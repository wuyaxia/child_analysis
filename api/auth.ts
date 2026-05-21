import type { VercelRequest, VercelResponse } from '@vercel/node';
import { Pool } from '@neondatabase/serverless';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (!process.env.DATABASE_URL) {
    res.status(500).json({ success: false, error: 'Server configuration error' });
    return;
  }

  const client = await pool.connect();
  
  try {
    const action = req.body?.action || req.query?.action;
    
    if (req.method === 'POST') {
      if (action === 'register') {
        await handleRegister(client, req, res);
      } else if (action === 'login') {
        await handleLogin(client, req, res);
      } else {
        res.status(400).json({ success: false, error: 'Invalid action' });
      }
    } else {
      res.status(405).json({ success: false, error: 'Method not allowed' });
    }
  } catch (error) {
    console.error('Auth error:', error);
    res.status(500).json({ success: false, error: 'Server error' });
  } finally {
    client.release();
  }
}

async function handleRegister(client: any, req: VercelRequest, res: VercelResponse) {
  const { username, password, email } = req.body;
  
  if (!username || !password) {
    res.status(400).json({ success: false, error: 'Username and password are required' });
    return;
  }

  const result = await client.query(
    'INSERT INTO users (username, password, email) VALUES ($1, $2, $3) RETURNING id, username, email, family_id, current_member_id',
    [username, password, email || null]
  );

  res.json({ success: true, user: result.rows[0] });
}

async function handleLogin(client: any, req: VercelRequest, res: VercelResponse) {
  const { username, password } = req.body;
  
  if (!username || !password) {
    res.status(400).json({ success: false, error: 'Username and password are required' });
    return;
  }

  const result = await client.query(
    'SELECT id, username, email, family_id, current_member_id FROM users WHERE username = $1 AND password = $2',
    [username, password]
  );

  if (result.rows.length === 0) {
    res.status(401).json({ success: false, error: 'Invalid credentials' });
    return;
  }

  const user = result.rows[0];
  const response: any = { success: true, user };

  // 如果用户有家庭，获取家庭信息
  if (user.family_id) {
    const familyResult = await client.query(
      'SELECT id, name, invite_code, created_at FROM families WHERE id = $1',
      [user.family_id]
    );
    if (familyResult.rows.length > 0) {
      response.family = {
        id: String(familyResult.rows[0].id),
        name: familyResult.rows[0].name,
        inviteCode: familyResult.rows[0].invite_code,
        createdAt: familyResult.rows[0].created_at?.toISOString()
      };
    }
  }

  // 如果用户有当前成员，获取成员信息
  if (user.current_member_id) {
    const memberResult = await client.query(
      'SELECT id, username, role, nickname, avatar, joined_at FROM family_members WHERE id = $1',
      [user.current_member_id]
    );
    if (memberResult.rows.length > 0) {
      response.currentMember = {
        id: String(memberResult.rows[0].id),
        username: memberResult.rows[0].username,
        role: memberResult.rows[0].role,
        nickname: memberResult.rows[0].nickname,
        avatar: memberResult.rows[0].avatar,
        joinedAt: memberResult.rows[0].joined_at?.toISOString()
      };
    }
  }

  res.json(response);
}
