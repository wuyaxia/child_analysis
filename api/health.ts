import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  try {
    const response = {
      success: true,
      message: 'API is working',
      timestamp: new Date().toISOString(),
      databaseUrl: process.env.DATABASE_URL ? 'Configured' : 'Missing',
      method: req.method,
      url: req.url
    };
    
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'API error',
      error: String(error)
    });
  }
}
