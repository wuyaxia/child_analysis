module.exports = async function handler(req, res) {
  res.setHeader('Content-Type', 'application/json');
  
  try {
    if (req.method !== 'POST') {
      res.statusCode = 405;
      res.end(JSON.stringify({ success: false, error: 'Method not allowed' }));
      return;
    }

    let body = '';
    await new Promise((resolve) => {
      req.on('data', (chunk) => { body += chunk; });
      req.on('end', resolve);
    });

    let data = {};
    if (body) {
      data = JSON.parse(body);
    }

    const { username, password } = data;

    if (!username || !password) {
      res.statusCode = 400;
      res.end(JSON.stringify({ success: false, error: 'Username and password are required' }));
      return;
    }

    const mockUser = {
      id: '1',
      username: username,
      familyId: '1',
      currentMemberId: '1',
      createdAt: new Date().toISOString(),
      lastLoginAt: new Date().toISOString()
    };

    const mockFamily = {
      id: '1',
      name: '测试家庭',
      inviteCode: 'ABC123',
      createdAt: new Date().toISOString()
    };

    res.statusCode = 200;
    res.end(JSON.stringify({
      success: true,
      message: 'Login successful',
      user: mockUser,
      family: mockFamily,
      familyMembers: [],
      children: []
    }));
    
  } catch (error) {
    res.statusCode = 500;
    res.end(JSON.stringify({ success: false, error: String(error) }));
  }
};
