import type { VercelRequest, VercelResponse } from '@vercel/node';
import { Pool } from '@neondatabase/serverless';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

async function verifyChildAccess(client: any, childId: number): Promise<boolean> {
  const result = await client.query('SELECT id FROM children WHERE id = $1', [childId]);
  return result.rows.length > 0;
}

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  if (!process.env.DATABASE_URL) {
    console.error('Missing DATABASE_URL environment variable');
    res.status(500).json({ success: false, message: 'Server configuration error' });
    return;
  }

  try {
    const client = await pool.connect();
    
    try {
      if (req.method === 'POST') {
        const { childId, age, title, sections } = req.body;

        if (!childId || !age || !title || !sections) {
          res.status(400).json({ success: false, message: 'childId, age, title, and sections are required' });
          return;
        }

        const hasAccess = await verifyChildAccess(client, childId);
        if (!hasAccess) {
          res.status(404).json({ success: false, message: 'Child not found' });
          return;
        }

        const insertResult = await client.query(
          'INSERT INTO analysis_reports (child_id, age, title, sections, created_at) VALUES ($1, $2, $3, $4, NOW()) RETURNING id, child_id, age, title, sections, created_at',
          [childId, age, title, sections]
        );

        const report = insertResult.rows[0];
        const reportResponse = {
          id: String(report.id),
          age: report.age,
          title: report.title,
          sections: report.sections,
          createdAt: report.created_at.toISOString()
        };

        res.json({
          success: true,
          message: 'Analysis report created successfully',
          data: reportResponse
        });

      } else if (req.method === 'GET') {
        const { reportId, childId, familyId, page = 1, limit = 20 } = req.query;
        const pageNum = parseInt(page as string);
        const limitNum = parseInt(limit as string);
        const offset = (pageNum - 1) * limitNum;

        if (reportId) {
          const reportResult = await client.query(
            'SELECT id, child_id, age, title, sections, created_at FROM analysis_reports WHERE id = $1',
            [reportId]
          );

          if (reportResult.rows.length === 0) {
            res.status(404).json({ success: false, message: 'Analysis report not found' });
            return;
          }

          const report = reportResult.rows[0];
          const reportResponse = {
            id: String(report.id),
            age: report.age,
            title: report.title,
            sections: report.sections,
            createdAt: report.created_at.toISOString()
          };

          res.json({
            success: true,
            data: reportResponse
          });

        } else if (childId) {
          const hasAccess = await verifyChildAccess(client, parseInt(childId as string));
          if (!hasAccess) {
            res.status(404).json({ success: false, message: 'Child not found' });
            return;
          }

          const countResult = await client.query(
            'SELECT COUNT(*) as count FROM analysis_reports WHERE child_id = $1',
            [childId]
          );
          const total = parseInt(countResult.rows[0].count);

          const reportsResult = await client.query(
            'SELECT id, child_id, age, title, sections, created_at FROM analysis_reports WHERE child_id = $1 ORDER BY created_at DESC LIMIT $2 OFFSET $3',
            [childId, limitNum, offset]
          );

          const reports = reportsResult.rows.map(report => ({
            id: String(report.id),
            age: report.age,
            title: report.title,
            sections: report.sections,
            createdAt: report.created_at.toISOString()
          }));

          res.json({
            success: true,
            data: reports,
            pagination: {
              page: pageNum,
              limit: limitNum,
              total,
              totalPages: Math.ceil(total / limitNum)
            }
          });

        } else if (familyId) {
          const reportsResult = await client.query(
            `SELECT ar.id, ar.child_id, ar.age, ar.title, ar.sections, ar.created_at 
             FROM analysis_reports ar
             JOIN children c ON ar.child_id = c.id
             WHERE c.family_id = $1
             ORDER BY ar.created_at DESC`,
            [familyId]
          );

          const reports = reportsResult.rows.map(report => ({
            id: String(report.id),
            age: report.age,
            title: report.title,
            sections: report.sections,
            createdAt: report.created_at.toISOString()
          }));

          res.json({
            success: true,
            reports
          });

        } else {
          res.status(400).json({ success: false, message: 'Either reportId, childId, or familyId is required' });
        }

      } else if (req.method === 'PUT') {
        const { reportId, age, title, sections } = req.body;

        if (!reportId) {
          res.status(400).json({ success: false, message: 'reportId is required' });
          return;
        }

        const updates: string[] = [];
        const values: any[] = [];
        let paramIndex = 1;

        if (age !== undefined) {
          updates.push(`age = $${paramIndex++}`);
          values.push(age);
        }
        if (title !== undefined) {
          updates.push(`title = $${paramIndex++}`);
          values.push(title);
        }
        if (sections !== undefined) {
          updates.push(`sections = $${paramIndex++}`);
          values.push(sections);
        }

        if (updates.length === 0) {
          res.status(400).json({ success: false, message: 'No fields to update' });
          return;
        }

        values.push(reportId);

        const updateResult = await client.query(
          `UPDATE analysis_reports SET ${updates.join(', ')} WHERE id = $${paramIndex} RETURNING id, child_id, age, title, sections, created_at`,
          values
        );

        if (updateResult.rows.length === 0) {
          res.status(404).json({ success: false, message: 'Analysis report not found' });
          return;
        }

        const report = updateResult.rows[0];
        const reportResponse = {
          id: String(report.id),
          age: report.age,
          title: report.title,
          sections: report.sections,
          createdAt: report.created_at.toISOString()
        };

        res.json({
          success: true,
          message: 'Analysis report updated successfully',
          data: reportResponse
        });

      } else if (req.method === 'DELETE') {
        const { reportId } = req.body;

        if (!reportId) {
          res.status(400).json({ success: false, message: 'reportId is required' });
          return;
        }

        const deleteResult = await client.query(
          'DELETE FROM analysis_reports WHERE id = $1',
          [reportId]
        );

        if (deleteResult.rowCount === 0) {
          res.status(404).json({ success: false, message: 'Analysis report not found' });
          return;
        }

        res.json({
          success: true,
          message: 'Analysis report deleted successfully'
        });

      } else {
        res.status(405).json({ success: false, message: 'Method not allowed' });
      }

    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Analysis report operation error:', error);
    res.status(500).json({ success: false, message: 'Analysis report operation failed' });
  }
}
