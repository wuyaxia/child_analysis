import type { VercelRequest, VercelResponse } from '@vercel/node';
import crypto from 'crypto';
import { USERS_STORAGE, hashPassword, generateSalt } from './login';

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password are required' });
  }

  if (username.length < 3) {
    return res.status(400).json({ error: 'Username must be at least 3 characters' });
  }

  if (password.length < 6) {
    return res.status(400).json({ error: 'Password must be at least 6 characters' });
  }

  if (USERS_STORAGE.has(username)) {
    return res.status(409).json({ error: 'Username already exists' });
  }

  const salt = generateSalt();
  const hash = hashPassword(password, salt);

  USERS_STORAGE.set(username, { password: hash, salt });

  return res.json({ 
    success: true, 
    message: 'Registration successful',
    token: Buffer.from(`${username}:${Date.now()}`).toString('base64')
  });
}
