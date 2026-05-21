import { Pool } from '@neondatabase/serverless';
import crypto from 'crypto';

function hashPassword(password: string, salt: string): string {
  return crypto.pbkdf2Sync(password, salt, 100000, 64, 'sha512').toString('hex');
}

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

export default async function handler(req, res) {
  res.setHeader('Content-Type', 'application/json');
  
  if (req.method !== 'POST') {
    res.statusCode = 405;
    res.end(JSON.stringify({ success: false, error: 'Method not allowed' }));
    return;
  }

  let body = '';
  await new Promise((resolve) => {
    req.on('data', (chunk) => { body += chunk; });
    req.on('end', resolve);
  });

  let { username, password } = {};
  try {
    if (body) {
      ({ username, password } = JSON.parse(body));
    }
  } catch (e) {
    res.statusCode = 400;
    res.end(JSON.stringify({ success: false, error: 'Invalid JSON' }));
    return;
  }

  if (!username || !password) {
    res.statusCode = 400;
    res.end(JSON.stringify({ success: false, error: 'Username and password are required' }));
    return;
  }

  if (!process.env.DATABASE_URL) {
    console.error('Missing DATABASE_URL');
    res.statusCode = 500;
    res.end(JSON.stringify({ success: false, error: 'Server configuration error' }));
    return;
  }

  try {
    const client = await pool.connect();
    
    try {
      const userResult = await client.query(
        'SELECT id, username, password_hash, salt, family_id, current_member_id, created_at, last_login_at FROM users WHERE username = $1',
        [username]
      );

      if (userResult.rows.length === 0) {
        res.statusCode = 401;
        res.end(JSON.stringify({ success: false, error: 'Invalid username or password' }));
        return;
      }

      const user = userResult.rows[0];
      const inputHash = hashPassword(password, user.salt);

      if (inputHash !== user.password_hash) {
        res.statusCode = 401;
        res.end(JSON.stringify({ success: false, error: 'Invalid username or password' }));
        return;
      }

      await client.query('UPDATE users SET last_login_at = NOW() WHERE id = $1', [user.id]);

      let family = null;
      let familyMembers = [];
      let children = [];

      if (user.family_id) {
        const familyResult = await client.query(
          'SELECT id, name, invite_code, created_at FROM families WHERE id = $1',
          [user.family_id]
        );

        if (familyResult.rows.length > 0) {
          family = {
            id: String(familyResult.rows[0].id),
            name: familyResult.rows[0].name,
            inviteCode: familyResult.rows[0].invite_code,
            createdAt: familyResult.rows[0].created_at.toISOString()
          };

          const membersResult = await client.query(
            'SELECT id, username, role, nickname, avatar, joined_at FROM family_members WHERE family_id = $1',
            [user.family_id]
          );
          familyMembers = membersResult.rows.map(member => ({
            id: String(member.id),
            username: member.username,
            role: member.role,
            nickname: member.nickname,
            avatar: member.avatar,
            joinedAt: member.joined_at.toISOString()
          }));

          const childrenResult = await client.query(
            'SELECT id, name, birth_date, gender, avatar, order_index, is_active, created_by, created_at, updated_at FROM children WHERE family_id = $1',
            [user.family_id]
          );
          children = childrenResult.rows.map(child => ({
            id: String(child.id),
            name: child.name,
            birthDate: child.birth_date.toISOString().split('T')[0],
            gender: child.gender,
            avatar: child.avatar,
            order: child.order_index,
            isActive: child.is_active,
            createdBy: String(child.created_by),
            createdAt: child.created_at.toISOString(),
            updatedAt: child.updated_at.toISOString()
          }));
        }
      }

      const userResponse = {
        id: String(user.id),
        username: user.username,
        familyId: user.family_id ? String(user.family_id) : null,
        currentMemberId: user.current_member_id ? String(user.current_member_id) : null,
        createdAt: user.created_at.toISOString(),
        lastLoginAt: new Date().toISOString()
      };

      res.statusCode = 200;
      res.end(JSON.stringify({ 
        success: true, 
        message: 'Login successful',
        user: userResponse,
        family,
        familyMembers,
        children
      }));
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Login error:', error);
    res.statusCode = 500;
    res.end(JSON.stringify({ success: false, error: 'Login failed' }));
  }
}
