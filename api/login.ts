import type { VercelRequest, VercelResponse } from '@vercel/node';
import crypto from 'crypto';

const USERS_STORAGE = new Map<string, { password: string; salt: string }>();

function hashPassword(password: string, salt: string): string {
  return crypto.pbkdf2Sync(password, salt, 100000, 64, 'sha512').toString('hex');
}

function generateSalt(): string {
  return crypto.randomBytes(32).toString('hex');
}

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

  const user = USERS_STORAGE.get(username);

  if (!user) {
    return res.status(401).json({ error: 'Invalid username or password' });
  }

  const hash = hashPassword(password, user.salt);

  if (hash !== user.password) {
    return res.status(401).json({ error: 'Invalid username or password' });
  }

  return res.json({ 
    success: true, 
    message: 'Login successful',
    token: Buffer.from(`${username}:${Date.now()}`).toString('base64')
  });
}

export { USERS_STORAGE, hashPassword, generateSalt };
