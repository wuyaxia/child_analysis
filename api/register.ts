import type { VercelRequest, VercelResponse } from '@vercel/node';
import { hashPassword, generateSalt } from './_lib/crypto';

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

  try {
    const projectId = process.env.VITE_FIREBASE_PROJECT_ID;
    const apiKey = process.env.VITE_FIREBASE_API_KEY;
    const baseUrl = `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents`;

    const checkUrl = `${baseUrl}/users/${encodeURIComponent(username)}?key=${apiKey}`;
    const checkResponse = await fetch(checkUrl);
    const checkData = await checkResponse.json();

    if (checkData.fields) {
      return res.status(409).json({ error: 'Username already exists' });
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
      return res.status(500).json({ error: 'Failed to create user' });
    }

    return res.json({ 
      success: true, 
      message: 'Registration successful',
      username
    });
  } catch (error) {
    console.error('Registration error:', error);
    return res.status(500).json({ error: 'Registration failed' });
  }
}
