export default async function handler(req, res) {
  res.setHeader('Content-Type', 'application/json');
  
  if (req.method === 'GET') {
    res.statusCode = 200;
    res.end(JSON.stringify({ 
      success: true, 
      message: 'API is working',
      timestamp: new Date().toISOString()
    }));
  } else {
    res.statusCode = 405;
    res.end(JSON.stringify({ success: false, error: 'Method not allowed' }));
  }
}
