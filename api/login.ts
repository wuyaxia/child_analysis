import type { VercelRequest, VercelResponse } from '@vercel/node';
import { Pool } from '@neondatabase/serverless';
import crypto from 'crypto';

function hashPassword(password: string, salt: string): string {
  return crypto.pbkdf2Sync(password, salt, 100000, 64, 'sha512').toString('hex');
}

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const { username, password } = req.body;

  if (!username || !password) {
    res.status(400).json({ error: 'Username and password are required' });
    return;
  }

  if (!process.env.DATABASE_URL) {
    console.error('Missing DATABASE_URL environment variable');
    res.status(500).json({ error: 'Server configuration error' });
    return;
  }

  try {
    const client = await pool.connect();
    
    try {
      const result = await client.query(
        'SELECT id, password_hash, salt FROM users WHERE username = $1',
        [username]
      );

      if (result.rows.length === 0) {
        res.status(401).json({ error: 'Invalid username or password' });
        return;
      }

      const user = result.rows[0];
      const inputHash = hashPassword(password, user.salt);

      if (inputHash !== user.password_hash) {
        res.status(401).json({ error: 'Invalid username or password' });
        return;
      }

      res.json({ 
        success: true, 
        message: 'Login successful',
        username
      });
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
}
