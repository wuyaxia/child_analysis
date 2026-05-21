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
        const { childId, title, age, date, problems, improvements, notes, createdBy } = req.body;

        if (!childId || !title || !age || !date) {
          res.status(400).json({ success: false, message: 'childId, title, age, and date are required' });
          return;
        }

        const hasAccess = await verifyChildAccess(client, childId);
        if (!hasAccess) {
          res.status(404).json({ success: false, message: 'Child not found' });
          return;
        }

        const insertResult = await client.query(
          'INSERT INTO reviews (child_id, title, age, date, problems, improvements, notes, created_by, created_at, updated_at) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW(), NOW()) RETURNING id, child_id, title, age, date, problems, improvements, notes, created_by, created_at, updated_at',
          [childId, title, age, date, problems || [], improvements || [], notes || null, createdBy]
        );

        const review = insertResult.rows[0];
        const reviewResponse = {
          id: String(review.id),
          title: review.title,
          age: review.age,
          date: review.date.toISOString().split('T')[0],
          problems: review.problems,
          improvements: review.improvements,
          notes: review.notes,
          createdBy: review.created_by ? String(review.created_by) : undefined,
          createdAt: review.created_at.toISOString(),
          updatedAt: review.updated_at.toISOString()
        };

        res.json({
          success: true,
          message: 'Review created successfully',
          data: reviewResponse
        });

      } else if (req.method === 'GET') {
        const { reviewId, childId, familyId, page = 1, limit = 20 } = req.query;
        const pageNum = parseInt(page as string);
        const limitNum = parseInt(limit as string);
        const offset = (pageNum - 1) * limitNum;

        if (reviewId) {
          const reviewResult = await client.query(
            'SELECT id, child_id, title, age, date, problems, improvements, notes, created_by, created_at, updated_at FROM reviews WHERE id = $1',
            [reviewId]
          );

          if (reviewResult.rows.length === 0) {
            res.status(404).json({ success: false, message: 'Review not found' });
            return;
          }

          const review = reviewResult.rows[0];
          const reviewResponse = {
            id: String(review.id),
            title: review.title,
            age: review.age,
            date: review.date.toISOString().split('T')[0],
            problems: review.problems,
            improvements: review.improvements,
            notes: review.notes,
            createdBy: review.created_by ? String(review.created_by) : undefined,
            createdAt: review.created_at.toISOString(),
            updatedAt: review.updated_at.toISOString()
          };

          res.json({
            success: true,
            data: reviewResponse
          });

        } else if (childId) {
          const hasAccess = await verifyChildAccess(client, parseInt(childId as string));
          if (!hasAccess) {
            res.status(404).json({ success: false, message: 'Child not found' });
            return;
          }

          const countResult = await client.query(
            'SELECT COUNT(*) as count FROM reviews WHERE child_id = $1',
            [childId]
          );
          const total = parseInt(countResult.rows[0].count);

          const reviewsResult = await client.query(
            'SELECT id, child_id, title, age, date, problems, improvements, notes, created_by, created_at, updated_at FROM reviews WHERE child_id = $1 ORDER BY date DESC, created_at DESC LIMIT $2 OFFSET $3',
            [childId, limitNum, offset]
          );

          const reviews = reviewsResult.rows.map(review => ({
            id: String(review.id),
            title: review.title,
            age: review.age,
            date: review.date.toISOString().split('T')[0],
            problems: review.problems,
            improvements: review.improvements,
            notes: review.notes,
            createdBy: review.created_by ? String(review.created_by) : undefined,
            createdAt: review.created_at.toISOString(),
            updatedAt: review.updated_at.toISOString()
          }));

          res.json({
            success: true,
            data: reviews,
            pagination: {
              page: pageNum,
              limit: limitNum,
              total,
              totalPages: Math.ceil(total / limitNum)
            }
          });

        } else if (familyId) {
          const reviewsResult = await client.query(
            `SELECT r.id, r.child_id, r.title, r.age, r.date, r.problems, r.improvements, r.notes, r.created_by, r.created_at, r.updated_at 
             FROM reviews r
             JOIN children c ON r.child_id = c.id
             WHERE c.family_id = $1
             ORDER BY r.date DESC, r.created_at DESC`,
            [familyId]
          );

          const reviews = reviewsResult.rows.map(review => ({
            id: String(review.id),
            title: review.title,
            age: review.age,
            date: review.date.toISOString().split('T')[0],
            problems: review.problems,
            improvements: review.improvements,
            notes: review.notes,
            createdBy: review.created_by ? String(review.created_by) : undefined,
            createdAt: review.created_at.toISOString(),
            updatedAt: review.updated_at.toISOString()
          }));

          res.json({
            success: true,
            reviews
          });

        } else {
          res.status(400).json({ success: false, message: 'Either reviewId, childId, or familyId is required' });
        }

      } else if (req.method === 'PUT') {
        const { reviewId, title, age, date, problems, improvements, notes } = req.body;

        if (!reviewId) {
          res.status(400).json({ success: false, message: 'reviewId is required' });
          return;
        }

        const updates: string[] = [];
        const values: any[] = [];
        let paramIndex = 1;

        if (title !== undefined) {
          updates.push(`title = $${paramIndex++}`);
          values.push(title);
        }
        if (age !== undefined) {
          updates.push(`age = $${paramIndex++}`);
          values.push(age);
        }
        if (date !== undefined) {
          updates.push(`date = $${paramIndex++}`);
          values.push(date);
        }
        if (problems !== undefined) {
          updates.push(`problems = $${paramIndex++}`);
          values.push(problems);
        }
        if (improvements !== undefined) {
          updates.push(`improvements = $${paramIndex++}`);
          values.push(improvements);
        }
        if (notes !== undefined) {
          updates.push(`notes = $${paramIndex++}`);
          values.push(notes);
        }

        if (updates.length === 0) {
          res.status(400).json({ success: false, message: 'No fields to update' });
          return;
        }

        values.push(reviewId);

        const updateResult = await client.query(
          `UPDATE reviews SET ${updates.join(', ')}, updated_at = NOW() WHERE id = $${paramIndex} RETURNING id, child_id, title, age, date, problems, improvements, notes, created_by, created_at, updated_at`,
          values
        );

        if (updateResult.rows.length === 0) {
          res.status(404).json({ success: false, message: 'Review not found' });
          return;
        }

        const review = updateResult.rows[0];
        const reviewResponse = {
          id: String(review.id),
          title: review.title,
          age: review.age,
          date: review.date.toISOString().split('T')[0],
          problems: review.problems,
          improvements: review.improvements,
          notes: review.notes,
          createdBy: review.created_by ? String(review.created_by) : undefined,
          createdAt: review.created_at.toISOString(),
          updatedAt: review.updated_at.toISOString()
        };

        res.json({
          success: true,
          message: 'Review updated successfully',
          data: reviewResponse
        });

      } else if (req.method === 'DELETE') {
        const { reviewId } = req.body;

        if (!reviewId) {
          res.status(400).json({ success: false, message: 'reviewId is required' });
          return;
        }

        const deleteResult = await client.query(
          'DELETE FROM reviews WHERE id = $1',
          [reviewId]
        );

        if (deleteResult.rowCount === 0) {
          res.status(404).json({ success: false, message: 'Review not found' });
          return;
        }

        res.json({
          success: true,
          message: 'Review deleted successfully'
        });

      } else {
        res.status(405).json({ success: false, message: 'Method not allowed' });
      }

    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Review operation error:', error);
    res.status(500).json({ success: false, message: 'Review operation failed' });
  }
}
