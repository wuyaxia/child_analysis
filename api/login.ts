import type { VercelRequest, VercelResponse } from '@vercel/node';
import crypto from 'crypto';

function hashPassword(password: string, salt: string): string {
  return crypto.pbkdf2Sync(password, salt, 100000, 64, 'sha512').toString('hex');
}

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

  const projectId = process.env.VITE_FIREBASE_PROJECT_ID;
  const apiKey = process.env.VITE_FIREBASE_API_KEY;

  if (!projectId || !apiKey) {
    console.error('Missing environment variables:', { projectId, apiKey });
    res.status(500).json({ error: 'Server configuration error' });
    return;
  }

  try {
    const baseUrl = `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents`;
    const userUrl = `${baseUrl}/users/${encodeURIComponent(username)}?key=${apiKey}`;

    const response = await fetch(userUrl);

    if (!response.ok && response.status !== 404) {
      console.error('Firebase API error:', response.status);
      res.status(500).json({ error: 'Database error' });
      return;
    }

    const data = await response.json();

    if (!data.fields) {
      res.status(401).json({ error: 'Invalid username or password' });
      return;
    }

    const storedHash = data.fields.passwordHash?.stringValue;
    const storedSalt = data.fields.salt?.stringValue;

    if (!storedHash || !storedSalt) {
      res.status(401).json({ error: 'Invalid username or password' });
      return;
    }

    const inputHash = hashPassword(password, storedSalt);

    if (inputHash !== storedHash) {
      res.status(401).json({ error: 'Invalid username or password' });
      return;
    }

    res.json({ 
      success: true, 
      message: 'Login successful',
      username
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
}
