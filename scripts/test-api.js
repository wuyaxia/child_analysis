import https from 'https';

const options = {
  hostname: 'workspace-smoky-three-82.vercel.app',
  port: 443,
  path: '/api/init-db',
  method: 'POST',
  timeout: 30000
};

const req = https.request(options, (res) => {
  console.log('状态码:', res.statusCode);
  
  let data = '';
  res.on('data', (chunk) => {
    data += chunk;
  });
  
  res.on('end', () => {
    console.log('响应:', data);
  });
});

req.on('error', (error) => {
  console.error('错误:', error.message);
});

req.on('timeout', () => {
  console.error('请求超时');
  req.destroy();
});

req.end();

