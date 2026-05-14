import type { VercelRequest, VercelResponse } from '@vercel/node';
import { hashPassword } from './_lib/crypto';

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

  try {
    const projectId = process.env.VITE_FIREBASE_PROJECT_ID;
    const apiKey = process.env.VITE_FIREBASE_API_KEY;
    const baseUrl = `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents`;

    const userUrl = `${baseUrl}/users/${encodeURIComponent(username)}?key=${apiKey}`;
    const response = await fetch(userUrl);
    const data = await response.json();

    if (!data.fields) {
      return res.status(401).json({ error: 'Invalid username or password' });
    }

    const storedHash = data.fields.passwordHash?.stringValue;
    const storedSalt = data.fields.salt?.stringValue;

    if (!storedHash || !storedSalt) {
      return res.status(401).json({ error: 'Invalid username or password' });
    }

    const inputHash = hashPassword(password, storedSalt);

    if (inputHash !== storedHash) {
      return res.status(401).json({ error: 'Invalid username or password' });
    }

    return res.json({ 
      success: true, 
      message: 'Login successful',
      username
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ error: 'Login failed' });
  }
}
