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
        const { childId, date, type, content, photos, tags, createdBy } = req.body;

        if (!childId || !date || !type || !content) {
          res.status(400).json({ success: false, message: 'childId, date, type, and content are required' });
          return;
        }

        if (!['daily', 'milestone', 'emotion', 'skill'].includes(type)) {
          res.status(400).json({ success: false, message: 'Type must be either "daily", "milestone", "emotion", or "skill"' });
          return;
        }

        const hasAccess = await verifyChildAccess(client, childId);
        if (!hasAccess) {
          res.status(404).json({ success: false, message: 'Child not found' });
          return;
        }

        const insertResult = await client.query(
          'INSERT INTO growth_records (child_id, date, record_type, content, photos, tags, created_by, created_at, updated_at) VALUES ($1, $2, $3, $4, $5, $6, $7, NOW(), NOW()) RETURNING id, child_id, date, record_type, content, photos, tags, created_by, created_at, updated_at',
          [childId, date, type, content, photos || [], tags || [], createdBy]
        );

        const record = insertResult.rows[0];
        const recordResponse = {
          id: String(record.id),
          date: record.date.toISOString().split('T')[0],
          type: record.record_type,
          content: record.content,
          photos: record.photos,
          tags: record.tags,
          createdBy: record.created_by ? String(record.created_by) : undefined,
          createdAt: record.created_at.toISOString(),
          updatedAt: record.updated_at.toISOString()
        };

        res.json({
          success: true,
          message: 'Growth record created successfully',
          data: recordResponse
        });

      } else if (req.method === 'GET') {
        const { recordId, childId, page = 1, limit = 20 } = req.query;
        const pageNum = parseInt(page as string);
        const limitNum = parseInt(limit as string);
        const offset = (pageNum - 1) * limitNum;

        if (recordId) {
          const recordResult = await client.query(
            'SELECT id, child_id, date, record_type, content, photos, tags, created_by, created_at, updated_at FROM growth_records WHERE id = $1',
            [recordId]
          );

          if (recordResult.rows.length === 0) {
            res.status(404).json({ success: false, message: 'Growth record not found' });
            return;
          }

          const record = recordResult.rows[0];
          const recordResponse = {
            id: String(record.id),
            date: record.date.toISOString().split('T')[0],
            type: record.record_type,
            content: record.content,
            photos: record.photos,
            tags: record.tags,
            createdBy: record.created_by ? String(record.created_by) : undefined,
            createdAt: record.created_at.toISOString(),
            updatedAt: record.updated_at.toISOString()
          };

          res.json({
            success: true,
            data: recordResponse
          });

        } else if (childId) {
          const hasAccess = await verifyChildAccess(client, parseInt(childId as string));
          if (!hasAccess) {
            res.status(404).json({ success: false, message: 'Child not found' });
            return;
          }

          const countResult = await client.query(
            'SELECT COUNT(*) as count FROM growth_records WHERE child_id = $1',
            [childId]
          );
          const total = parseInt(countResult.rows[0].count);

          const recordsResult = await client.query(
            'SELECT id, child_id, date, record_type, content, photos, tags, created_by, created_at, updated_at FROM growth_records WHERE child_id = $1 ORDER BY date DESC, created_at DESC LIMIT $2 OFFSET $3',
            [childId, limitNum, offset]
          );

          const records = recordsResult.rows.map(record => ({
            id: String(record.id),
            date: record.date.toISOString().split('T')[0],
            type: record.record_type,
            content: record.content,
            photos: record.photos,
            tags: record.tags,
            createdBy: record.created_by ? String(record.created_by) : undefined,
            createdAt: record.created_at.toISOString(),
            updatedAt: record.updated_at.toISOString()
          }));

          res.json({
            success: true,
            data: records,
            pagination: {
              page: pageNum,
              limit: limitNum,
              total,
              totalPages: Math.ceil(total / limitNum)
            }
          });

        } else {
          res.status(400).json({ success: false, message: 'Either recordId or childId is required' });
        }

      } else if (req.method === 'PUT') {
        const { recordId, date, type, content, photos, tags } = req.body;

        if (!recordId) {
          res.status(400).json({ success: false, message: 'recordId is required' });
          return;
        }

        if (type && !['daily', 'milestone', 'emotion', 'skill'].includes(type)) {
          res.status(400).json({ success: false, message: 'Type must be either "daily", "milestone", "emotion", or "skill"' });
          return;
        }

        const updates: string[] = [];
        const values: any[] = [];
        let paramIndex = 1;

        if (date !== undefined) {
          updates.push(`date = $${paramIndex++}`);
          values.push(date);
        }
        if (type) {
          updates.push(`record_type = $${paramIndex++}`);
          values.push(type);
        }
        if (content !== undefined) {
          updates.push(`content = $${paramIndex++}`);
          values.push(content);
        }
        if (photos !== undefined) {
          updates.push(`photos = $${paramIndex++}`);
          values.push(photos);
        }
        if (tags !== undefined) {
          updates.push(`tags = $${paramIndex++}`);
          values.push(tags);
        }

        if (updates.length === 0) {
          res.status(400).json({ success: false, message: 'No fields to update' });
          return;
        }

        values.push(recordId);

        const updateResult = await client.query(
          `UPDATE growth_records SET ${updates.join(', ')}, updated_at = NOW() WHERE id = $${paramIndex} RETURNING id, child_id, date, record_type, content, photos, tags, created_by, created_at, updated_at`,
          values
        );

        if (updateResult.rows.length === 0) {
          res.status(404).json({ success: false, message: 'Growth record not found' });
          return;
        }

        const record = updateResult.rows[0];
        const recordResponse = {
          id: String(record.id),
          date: record.date.toISOString().split('T')[0],
          type: record.record_type,
          content: record.content,
          photos: record.photos,
          tags: record.tags,
          createdBy: record.created_by ? String(record.created_by) : undefined,
          createdAt: record.created_at.toISOString(),
          updatedAt: record.updated_at.toISOString()
        };

        res.json({
          success: true,
          message: 'Growth record updated successfully',
          data: recordResponse
        });

      } else if (req.method === 'DELETE') {
        const { recordId } = req.body;

        if (!recordId) {
          res.status(400).json({ success: false, message: 'recordId is required' });
          return;
        }

        const deleteResult = await client.query(
          'DELETE FROM growth_records WHERE id = $1',
          [recordId]
        );

        if (deleteResult.rowCount === 0) {
          res.status(404).json({ success: false, message: 'Growth record not found' });
          return;
        }

        res.json({
          success: true,
          message: 'Growth record deleted successfully'
        });

      } else {
        res.status(405).json({ success: false, message: 'Method not allowed' });
      }

    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Growth record operation error:', error);
    res.status(500).json({ success: false, message: 'Growth record operation failed' });
  }
}
