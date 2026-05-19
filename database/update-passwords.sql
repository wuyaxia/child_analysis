-- 更新现有用户的密码哈希
UPDATE users SET 
    password_hash = '4b9c4b11899ecf8eed9678d70eb38222282bd27e13bdfade04a993acd3b91e8e4195da6d9a5e406d0c2ceb9f60af9b8ed96729e0edb9bab41352382ba4efd0bb',
    salt = '0123456789abcdef0123456789abcdef'
WHERE username = 'mom';

UPDATE users SET 
    password_hash = '236c6a72e2dd24cb0b302423c8e1387e8cc994b20df4f3a123735b5c375e9c1b11eac4d7ef3b316dcd5bcf554419a940b8b3c1d532ac5fb325b31a0028c9a332',
    salt = '1234567890abcdef1234567890abcdef'
WHERE username = 'dad';

UPDATE users SET 
    password_hash = 'b16f2c8dae06a2763369a50a871c9c1d2912b764ad0f86af0e4b2e5093e34a88ab0f51d6255747b2d059488f581675f45bb077bacc786440f3d7f7b5ab5f57fc',
    salt = '2345678901abcdef2345678901abcdef'
WHERE username = 'grandpa';

UPDATE users SET 
    password_hash = 'a8a8cb5d7b8453b7ba7370d774b965c0c596dbe056b7ff1851cdd538475eb2372ad7c84b3c444713ef9dce0d1565053c45acf745ae6242cadb3bd08cbccbe0d9',
    salt = '3456789012abcdef3456789012abcdef'
WHERE username = 'grandma';

-- 验证更新
SELECT username, password_hash, salt FROM users WHERE username IN ('mom', 'dad', 'grandpa', 'grandma');
