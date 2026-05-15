import type { VercelRequest, VercelResponse } from '@vercel/node';
import crypto from 'crypto';

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

  const projectId = process.env.VITE_FIREBASE_PROJECT_ID;
  const apiKey = process.env.VITE_FIREBASE_API_KEY;

  if (!projectId || !apiKey) {
    console.error('Missing environment variables:', { projectId, apiKey });
    res.status(500).json({ error: 'Server configuration error' });
    return;
  }

  try {
    const baseUrl = `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents`;
    const checkUrl = `${baseUrl}/users/${encodeURIComponent(username)}?key=${apiKey}`;

    const checkResponse = await fetch(checkUrl);

    if (checkResponse.ok) {
      const checkData = await checkResponse.json();
      if (checkData.fields) {
        res.status(409).json({ error: 'Username already exists' });
        return;
      }
    }

    const salt = generateSalt();
    const passwordHash = hashPassword(password, salt);

    const createUrl = `${baseUrl}/users?key=${apiKey}`;
    const createResponse = await fetch(createUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        fields: {
          name: { stringValue: username },
          passwordHash: { stringValue: passwordHash },
          salt: { stringValue: salt },
          createdAt: { stringValue: new Date().toISOString() }
        },
        documentId: username
      })
    });

    if (!createResponse.ok) {
      const errorData = await createResponse.json();
      console.error('Firebase error:', errorData);
      res.status(500).json({ error: 'Failed to create user' });
      return;
    }

    res.json({ 
      success: true, 
      message: 'Registration successful',
      username
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Registration failed' });
  }
}
