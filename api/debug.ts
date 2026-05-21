import type { VercelRequest, VercelResponse } from '@vercel/node';
import { Pool } from '@neondatabase/serverless';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  if (!process.env.DATABASE_URL) {
    return res.status(500).json({ success: false, message: 'Server configuration error' });
  }

  const client = await pool.connect();
  try {
    console.log('=== DEBUG: Checking database ===');
    
    // Check tables
    const tablesResult = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `);
    
    const tables = tablesResult.rows.map((r: any) => r.table_name);
    console.log('Tables found:', tables);
    
    // Check tasks
    const tasksResult = await client.query('SELECT * FROM tasks');
    console.log('Tasks in DB:', tasksResult.rows.length);
    
    // Check growth_measurements
    const measurementsResult = await client.query('SELECT * FROM growth_measurements');
    console.log('Measurements in DB:', measurementsResult.rows.length);
    
    // Check children
    const childrenResult = await client.query('SELECT * FROM children');
    console.log('Children in DB:', childrenResult.rows.length);
    
    res.json({
      success: true,
      tables,
      tasksCount: tasksResult.rows.length,
      tasks: tasksResult.rows,
      measurementsCount: measurementsResult.rows.length,
      measurements: measurementsResult.rows,
      childrenCount: childrenResult.rows.length,
      children: childrenResult.rows
    });
    
  } catch (error) {
    console.error('Debug error:', error);
    res.status(500).json({ success: false, error: String(error) });
  } finally {
    client.release();
  }
}
