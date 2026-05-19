import crypto from 'crypto';

function hashPassword(password, salt) {
  return crypto.pbkdf2Sync(password, salt, 100000, 64, 'sha512').toString('hex');
}

// 测试 sample-data.sql 中的 salt 和密码
const testCases = [
  {
    username: 'mom',
    password: '123456',
    salt: '0123456789abcdef0123456789abcdef',
    expectedHash: '0f5fa3a2580c09c6c68cc3c0405bc0f4e8b3515b8881e6e516a7f3d27691c4b7735058d5a277c81d9885094e246847e0c4f20a8837d3953197e578'
  },
  {
    username: 'dad',
    password: '123456',
    salt: '1234567890abcdef1234567890abcdef',
    expectedHash: '0f5fa3a2580c09c6c68cc3c0405bc0f4e8b3515b8881e6e516a7f3d27691c4b7735058d5a277c81d9885094e246847e0c4f20a8837d3953197e578'
  },
  {
    username: 'grandpa',
    password: '123456',
    salt: '2345678901abcdef2345678901abcdef',
    expectedHash: '0f5fa3a2580c09c6c68cc3c0405bc0f4e8b3515b8881e6e516a7f3d27691c4b7735058d5a277c81d9885094e246847e0c4f20a8837d3953197e578'
  },
  {
    username: 'grandma',
    password: '123456',
    salt: '3456789012abcdef3456789012abcdef',
    expectedHash: '0f5fa3a2580c09c6c68cc3c0405bc0f4e8b3515b8881e6e516a7f3d27691c4b7735058d5a277c81d9885094e246847e0c4f20a8837d3953197e578'
  }
];

console.log('=== 密码哈希测试 ===\n');

const correctHashes = {};

testCases.forEach(test => {
  const actualHash = hashPassword(test.password, test.salt);
  const isMatch = actualHash === test.expectedHash;
  
  correctHashes[test.username] = { hash: actualHash, salt: test.salt };
  
  console.log(`用户: ${test.username}`);
  console.log(`密码: ${test.password}`);
  console.log(`Salt: ${test.salt}`);
  console.log(`匹配结果: ${isMatch ? '✅ 匹配' : '❌ 不匹配'}`);
  if (!isMatch) {
    console.log(`正确哈希: ${actualHash}`);
  }
  console.log('---\n');
});

console.log('=== 正确的 SQL INSERT 语句 ===');
console.log("INSERT INTO users (username, password_hash, salt) VALUES");
Object.entries(correctHashes).forEach(([username, data], index, arr) => {
  const comma = index < arr.length - 1 ? ',' : '';
  console.log(`    ('${username}', '${data.hash}', '${data.salt}')${comma}`);
});
console.log("ON CONFLICT (username) DO NOTHING;");
