
import pkg from 'pg';
const { Pool } = pkg;
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// 使用之前提供的数据库连接信息
const DATABASE_URL = 'postgres://postgres.qsrxtsjrozyatxlbrptn:s3IIoLHGVekruXRo@aws-1-us-east-1.pooler.supabase.com:6543/postgres?sslmode=require';

async function initDatabase() {
  console.log('正在连接数据库...');
  
  const pool = new Pool({ connectionString: DATABASE_URL });
  
  try {
    const client = await pool.connect();
    console.log('✅ 数据库连接成功！');
    
    try {
      console.log('正在执行初始化脚本...');
      
      // 读取 SQL 脚本
      const sqlPath = path.join(__dirname, '../database/schema.sql');
      const sqlScript = await fs.readFile(sqlPath, 'utf8');
      
      // 执行 SQL 脚本
      await client.query(sqlScript);
      
      console.log('🎉 数据库表创建成功！');
      
      // 验证表是否创建成功
      const result = await client.query(`
        SELECT table_name 
        FROM information_schema.tables 
        WHERE table_schema = 'public'
        ORDER BY table_name;
      `);
      
      console.log('\n已创建的表:');
      result.rows.forEach(row => {
        console.log(`  - ${row.table_name}`);
      });
      
    } finally {
      client.release();
    }
    
  } catch (error) {
    console.error('❌ 数据库初始化失败:', error);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

initDatabase();

