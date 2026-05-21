import type { VercelRequest, VercelResponse } from '@vercel/node';
import { Pool } from '@neondatabase/serverless';
import crypto from 'crypto';

function hashPassword(password: string, salt: string): string {
  return crypto.pbkdf2Sync(password, salt, 100000, 64, 'sha512').toString('hex');
}

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Content-Type', 'application/json');
  
  try {
    if (req.method !== 'POST') {
      res.status(405).json({ success: false, error: 'Method not allowed' });
      return;
    }

    const { username, password } = req.body as { username?: string; password?: string };

    if (!username || !password) {
      res.status(400).json({ success: false, error: 'Username and password are required' });
      return;
    }

    if (!process.env.DATABASE_URL) {
      console.error('Missing DATABASE_URL environment variable');
      res.status(500).json({ success: false, error: 'Server configuration error' });
      return;
    }

    const client = await pool.connect();
    
    try {
      const userResult = await client.query(
        'SELECT id, username, password_hash, salt, family_id, current_member_id, created_at, last_login_at FROM users WHERE username = $1',
        [username]
      );

      if (userResult.rows.length === 0) {
        res.status(401).json({ success: false, error: 'Invalid username or password' });
        return;
      }

      const userRow = userResult.rows[0];
      const hashedPassword = hashPassword(password, userRow.salt);

      if (hashedPassword !== userRow.password_hash) {
        res.status(401).json({ success: false, error: 'Invalid username or password' });
        return;
      }

      await client.query(
        'UPDATE users SET last_login_at = NOW() WHERE id = $1',
        [userRow.id]
      );

      let familyData = null;
      let memberData = null;
      let childrenData = [];
      let membersData = [];

      if (userRow.family_id) {
        const familyResult = await client.query(
          'SELECT id, name, invite_code, created_at FROM families WHERE id = $1',
          [userRow.family_id]
        );
        
        if (familyResult.rows.length > 0) {
          const familyRow = familyResult.rows[0];
          familyData = {
            id: String(familyRow.id),
            name: familyRow.name,
            inviteCode: familyRow.invite_code,
            createdAt: familyRow.created_at.toISOString()
          };
        }

        if (userRow.current_member_id) {
          const memberResult = await client.query(
            'SELECT id, user_id, family_id, role, nickname, created_at FROM family_members WHERE id = $1',
            [userRow.current_member_id]
          );
          
          if (memberResult.rows.length > 0) {
            const memberRow = memberResult.rows[0];
            memberData = {
              id: String(memberRow.id),
              userId: String(memberRow.user_id),
              familyId: String(memberRow.family_id),
              role: memberRow.role as 'parent' | 'child' | 'other',
              nickname: memberRow.nickname,
              createdAt: memberRow.created_at.toISOString()
            };
          }
        }

        const childrenResult = await client.query(
          'SELECT id, family_id, name, birth_date, gender, avatar, created_at FROM children WHERE family_id = $1',
          [userRow.family_id]
        );
        
        childrenData = childrenResult.rows.map(child => ({
          id: String(child.id),
          familyId: String(child.family_id),
          name: child.name,
          birthDate: child.birth_date.toISOString(),
          gender: child.gender as 'boy' | 'girl',
          avatar: child.avatar || null,
          createdAt: child.created_at.toISOString()
        }));

        const membersResult = await client.query(
          'SELECT id, user_id, family_id, role, nickname, created_at FROM family_members WHERE family_id = $1',
          [userRow.family_id]
        );
        
        membersData = membersResult.rows.map(member => ({
          id: String(member.id),
          userId: String(member.user_id),
          familyId: String(member.family_id),
          role: member.role as 'parent' | 'child' | 'other',
          nickname: member.nickname,
          createdAt: member.created_at.toISOString()
        }));
      }

      const userResponse = {
        id: String(userRow.id),
        username: userRow.username,
        familyId: userRow.family_id ? String(userRow.family_id) : null,
        currentMemberId: userRow.current_member_id ? String(userRow.current_member_id) : null,
        createdAt: userRow.created_at.toISOString(),
        lastLoginAt: userRow.last_login_at.toISOString()
      };

      res.status(200).json({
        success: true,
        message: 'Login successful',
        user: userResponse,
        family: familyData,
        currentMember: memberData,
        familyMembers: membersData,
        children: childrenData
      });
      
    } finally {
      client.release();
    }
    
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ success: false, error: String(error) });
  }
}
