import type { VercelRequest, VercelResponse } from '@vercel/node';
import { Pool } from '@neondatabase/serverless';
import crypto from 'crypto';

function hashPassword(password: string, salt: string): string {
  return crypto.pbkdf2Sync(password, salt, 100000, 64, 'sha512').toString('hex');
}

function generateSalt(): string {
  return crypto.randomBytes(32).toString('hex');
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

  if (username.length < 3) {
    res.status(400).json({ error: 'Username must be at least 3 characters' });
    return;
  }

  if (password.length < 6) {
    res.status(400).json({ error: 'Password must be at least 6 characters' });
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
      const checkResult = await client.query(
        'SELECT id FROM users WHERE username = $1',
        [username]
      );

      if (checkResult.rows.length > 0) {
        res.status(409).json({ error: 'Username already exists' });
        return;
      }

      const salt = generateSalt();
      const passwordHash = hashPassword(password, salt);

      await client.query(
        'INSERT INTO users (username, password_hash, salt, created_at) VALUES ($1, $2, $3, NOW())',
        [username, passwordHash, salt]
      );

      res.json({ 
        success: true, 
        message: 'Registration successful',
        username
      });
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Registration failed' });
  }
}
