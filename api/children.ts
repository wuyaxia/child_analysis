import type { VercelRequest, VercelResponse } from '@vercel/node';
import { Pool } from '@neondatabase/serverless';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  if (!process.env.DATABASE_URL) {
    console.error('Missing DATABASE_URL environment variable');
    res.status(500).json({ error: 'Server configuration error' });
    return;
  }

  try {
    const client = await pool.connect();
    
    try {
      if (req.method === 'POST') {
        const { familyId, name, birthDate, gender, avatar, createdBy } = req.body;

        if (!familyId || !name || !birthDate || !gender || !createdBy) {
          res.status(400).json({ error: 'familyId, name, birthDate, gender, and createdBy are required' });
          return;
        }

        if (!['boy', 'girl'].includes(gender)) {
          res.status(400).json({ error: 'Gender must be either "boy" or "girl"' });
          return;
        }

        const familyResult = await client.query(
          'SELECT id FROM families WHERE id = $1',
          [familyId]
        );

        if (familyResult.rows.length === 0) {
          res.status(404).json({ error: 'Family not found' });
          return;
        }

        const countResult = await client.query(
          'SELECT COUNT(*) as count FROM children WHERE family_id = $1',
          [familyId]
        );
        const orderIndex = parseInt(countResult.rows[0].count);

        const insertResult = await client.query(
          'INSERT INTO children (family_id, name, birth_date, gender, avatar, order_index, is_active, created_by, created_at, updated_at) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW(), NOW()) RETURNING id, name, birth_date, gender, avatar, order_index, is_active, created_by, created_at, updated_at',
          [familyId, name, birthDate, gender, avatar, orderIndex, true, createdBy]
        );

        const child = insertResult.rows[0];
        const childResponse = {
          id: String(child.id),
          name: child.name,
          birthDate: child.birth_date.toISOString().split('T')[0],
          gender: child.gender,
          avatar: child.avatar,
          order: child.order_index,
          isActive: child.is_active,
          createdBy: String(child.created_by),
          createdAt: child.created_at.toISOString(),
          updatedAt: child.updated_at.toISOString()
        };

        res.json({
          success: true,
          message: 'Child created successfully',
          child: childResponse
        });

      } else if (req.method === 'GET') {
        const { childId, familyId } = req.query;

        if (childId) {
          const childResult = await client.query(
            'SELECT id, name, birth_date, gender, avatar, order_index, is_active, created_by, created_at, updated_at FROM children WHERE id = $1',
            [childId]
          );

          if (childResult.rows.length === 0) {
            res.status(404).json({ error: 'Child not found' });
            return;
          }

          const child = childResult.rows[0];
          const childResponse = {
            id: String(child.id),
            name: child.name,
            birthDate: child.birth_date.toISOString().split('T')[0],
            gender: child.gender,
            avatar: child.avatar,
            order: child.order_index,
            isActive: child.is_active,
            createdBy: String(child.created_by),
            createdAt: child.created_at.toISOString(),
            updatedAt: child.updated_at.toISOString()
          };

          res.json({
            success: true,
            child: childResponse
          });

        } else if (familyId) {
          const childrenResult = await client.query(
            'SELECT id, name, birth_date, gender, avatar, order_index, is_active, created_by, created_at, updated_at FROM children WHERE family_id = $1 ORDER BY order_index',
            [familyId]
          );

          const children = childrenResult.rows.map(child => ({
            id: String(child.id),
            name: child.name,
            birthDate: child.birth_date.toISOString().split('T')[0],
            gender: child.gender,
            avatar: child.avatar,
            order: child.order_index,
            isActive: child.is_active,
            createdBy: String(child.created_by),
            createdAt: child.created_at.toISOString(),
            updatedAt: child.updated_at.toISOString()
          }));

          res.json({
            success: true,
            children
          });

        } else {
          res.status(400).json({ error: 'Either childId or familyId is required' });
        }

      } else if (req.method === 'PUT') {
        const { childId, name, birthDate, gender, avatar, order, isActive } = req.body;

        if (!childId) {
          res.status(400).json({ error: 'childId is required' });
          return;
        }

        if (gender && !['boy', 'girl'].includes(gender)) {
          res.status(400).json({ error: 'Gender must be either "boy" or "girl"' });
          return;
        }

        const updates: string[] = [];
        const values: any[] = [];
        let paramIndex = 1;

        if (name !== undefined) {
          updates.push(`name = $${paramIndex++}`);
          values.push(name);
        }
        if (birthDate !== undefined) {
          updates.push(`birth_date = $${paramIndex++}`);
          values.push(birthDate);
        }
        if (gender) {
          updates.push(`gender = $${paramIndex++}`);
          values.push(gender);
        }
        if (avatar !== undefined) {
          updates.push(`avatar = $${paramIndex++}`);
          values.push(avatar);
        }
        if (order !== undefined) {
          updates.push(`order_index = $${paramIndex++}`);
          values.push(order);
        }
        if (isActive !== undefined) {
          updates.push(`is_active = $${paramIndex++}`);
          values.push(isActive);
        }

        if (updates.length === 0) {
          res.status(400).json({ error: 'No fields to update' });
          return;
        }

        values.push(childId);

        const updateResult = await client.query(
          `UPDATE children SET ${updates.join(', ')}, updated_at = NOW() WHERE id = $${paramIndex} RETURNING id, name, birth_date, gender, avatar, order_index, is_active, created_by, created_at, updated_at`,
          values
        );

        if (updateResult.rows.length === 0) {
          res.status(404).json({ error: 'Child not found' });
          return;
        }

        const child = updateResult.rows[0];
        const childResponse = {
          id: String(child.id),
          name: child.name,
          birthDate: child.birth_date.toISOString().split('T')[0],
          gender: child.gender,
          avatar: child.avatar,
          order: child.order_index,
          isActive: child.is_active,
          createdBy: String(child.created_by),
          createdAt: child.created_at.toISOString(),
          updatedAt: child.updated_at.toISOString()
        };

        res.json({
          success: true,
          message: 'Child updated successfully',
          child: childResponse
        });

      } else if (req.method === 'DELETE') {
        const { childId } = req.body;

        if (!childId) {
          res.status(400).json({ error: 'childId is required' });
          return;
        }

        const deleteResult = await client.query(
          'DELETE FROM children WHERE id = $1',
          [childId]
        );

        if (deleteResult.rowCount === 0) {
          res.status(404).json({ error: 'Child not found' });
          return;
        }

        res.json({
          success: true,
          message: 'Child deleted successfully'
        });

      } else {
        res.status(405).json({ error: 'Method not allowed' });
      }

    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Child operation error:', error);
    res.status(500).json({ error: 'Child operation failed' });
  }
}
