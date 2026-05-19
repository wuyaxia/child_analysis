import type { VercelRequest, VercelResponse } from '@vercel/node';
import { Pool } from '@neondatabase/serverless';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

const validCategories = ['routine', 'exercise', 'cognitive', 'social', 'selfcare', 'artistic', 'safety'];
const validDifficulties = ['easy', 'medium', 'hard'];
const validFrequencies = ['daily', 'weekly', 'once'];

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
        const { childId, title, description, category, difficulty, ageMin, ageMax, duration, knowledgeIds, frequency, isCustom, createdBy } = req.body;

        if (!title || !category || !difficulty || ageMin === undefined || ageMax === undefined || duration === undefined || !frequency) {
          res.status(400).json({ success: false, message: 'title, category, difficulty, ageMin, ageMax, duration, and frequency are required' });
          return;
        }

        if (!validCategories.includes(category)) {
          res.status(400).json({ success: false, message: 'Invalid category' });
          return;
        }

        if (!validDifficulties.includes(difficulty)) {
          res.status(400).json({ success: false, message: 'Invalid difficulty' });
          return;
        }

        if (!validFrequencies.includes(frequency)) {
          res.status(400).json({ success: false, message: 'Invalid frequency' });
          return;
        }

        if (childId) {
          const hasAccess = await verifyChildAccess(client, childId);
          if (!hasAccess) {
            res.status(404).json({ success: false, message: 'Child not found' });
            return;
          }
        }

        const insertResult = await client.query(
          'INSERT INTO tasks (child_id, title, description, category, difficulty, age_min, age_max, duration, knowledge_ids, frequency, completed_dates, is_custom, created_by, created_at, updated_at) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, NOW(), NOW()) RETURNING id, child_id, title, description, category, difficulty, age_min, age_max, duration, knowledge_ids, frequency, completed_dates, is_custom, created_by, created_at, updated_at',
          [childId, title, description, category, difficulty, ageMin, ageMax, duration, knowledgeIds || [], frequency, [], isCustom || false, createdBy]
        );

        const task = insertResult.rows[0];
        const taskResponse = {
          id: String(task.id),
          title: task.title,
          description: task.description,
          category: task.category,
          difficulty: task.difficulty,
          ageRange: { min: task.age_min, max: task.age_max },
          duration: task.duration,
          knowledgeIds: task.knowledge_ids,
          frequency: task.frequency,
          completedDates: task.completed_dates.map((d: Date) => d.toISOString().split('T')[0]),
          isCustom: task.is_custom,
          createdBy: task.created_by ? String(task.created_by) : undefined,
          createdAt: task.created_at.toISOString(),
          updatedAt: task.updated_at.toISOString()
        };

        res.json({
          success: true,
          message: 'Task created successfully',
          data: taskResponse
        });

      } else if (req.method === 'GET') {
        const { taskId, childId, isCustom, category, page = 1, limit = 20 } = req.query;
        const pageNum = parseInt(page as string);
        const limitNum = parseInt(limit as string);
        const offset = (pageNum - 1) * limitNum;

        if (taskId) {
          const taskResult = await client.query(
            'SELECT id, child_id, title, description, category, difficulty, age_min, age_max, duration, knowledge_ids, frequency, completed_dates, is_custom, created_by, created_at, updated_at FROM tasks WHERE id = $1',
            [taskId]
          );

          if (taskResult.rows.length === 0) {
            res.status(404).json({ success: false, message: 'Task not found' });
            return;
          }

          const task = taskResult.rows[0];
          const taskResponse = {
            id: String(task.id),
            title: task.title,
            description: task.description,
            category: task.category,
            difficulty: task.difficulty,
            ageRange: { min: task.age_min, max: task.age_max },
            duration: task.duration,
            knowledgeIds: task.knowledge_ids,
            frequency: task.frequency,
            completedDates: task.completed_dates.map((d: Date) => d.toISOString().split('T')[0]),
            isCustom: task.is_custom,
            createdBy: task.created_by ? String(task.created_by) : undefined,
            createdAt: task.created_at.toISOString(),
            updatedAt: task.updated_at.toISOString()
          };

          res.json({
            success: true,
            data: taskResponse
          });

        } else if (childId) {
          const hasAccess = await verifyChildAccess(client, parseInt(childId as string));
          if (!hasAccess) {
            res.status(404).json({ success: false, message: 'Child not found' });
            return;
          }

          let whereClause = 'WHERE child_id = $1';
          const values: any[] = [childId];
          let paramIndex = 2;

          if (isCustom !== undefined) {
            whereClause += ` AND is_custom = $${paramIndex++}`;
            values.push(isCustom === 'true');
          }

          if (category) {
            whereClause += ` AND category = $${paramIndex++}`;
            values.push(category);
          }

          const countResult = await client.query(
            `SELECT COUNT(*) as count FROM tasks ${whereClause}`,
            values
          );
          const total = parseInt(countResult.rows[0].count);

          const tasksResult = await client.query(
            `SELECT id, child_id, title, description, category, difficulty, age_min, age_max, duration, knowledge_ids, frequency, completed_dates, is_custom, created_by, created_at, updated_at FROM tasks ${whereClause} ORDER BY created_at DESC LIMIT $${paramIndex++} OFFSET $${paramIndex++}`,
            [...values, limitNum, offset]
          );

          const tasks = tasksResult.rows.map(task => ({
            id: String(task.id),
            title: task.title,
            description: task.description,
            category: task.category,
            difficulty: task.difficulty,
            ageRange: { min: task.age_min, max: task.age_max },
            duration: task.duration,
            knowledgeIds: task.knowledge_ids,
            frequency: task.frequency,
            completedDates: task.completed_dates.map((d: Date) => d.toISOString().split('T')[0]),
            isCustom: task.is_custom,
            createdBy: task.created_by ? String(task.created_by) : undefined,
            createdAt: task.created_at.toISOString(),
            updatedAt: task.updated_at.toISOString()
          }));

          res.json({
            success: true,
            data: tasks,
            pagination: {
              page: pageNum,
              limit: limitNum,
              total,
              totalPages: Math.ceil(total / limitNum)
            }
          });

        } else {
          let whereClause = 'WHERE 1=1';
          const values: any[] = [];
          let paramIndex = 1;

          if (isCustom !== undefined) {
            whereClause += ` AND is_custom = $${paramIndex++}`;
            values.push(isCustom === 'true');
          }

          if (category) {
            whereClause += ` AND category = $${paramIndex++}`;
            values.push(category);
          }

          const countResult = await client.query(
            `SELECT COUNT(*) as count FROM tasks ${whereClause}`,
            values
          );
          const total = parseInt(countResult.rows[0].count);

          const tasksResult = await client.query(
            `SELECT id, child_id, title, description, category, difficulty, age_min, age_max, duration, knowledge_ids, frequency, completed_dates, is_custom, created_by, created_at, updated_at FROM tasks ${whereClause} ORDER BY created_at DESC LIMIT $${paramIndex++} OFFSET $${paramIndex++}`,
            [...values, limitNum, offset]
          );

          const tasks = tasksResult.rows.map(task => ({
            id: String(task.id),
            title: task.title,
            description: task.description,
            category: task.category,
            difficulty: task.difficulty,
            ageRange: { min: task.age_min, max: task.age_max },
            duration: task.duration,
            knowledgeIds: task.knowledge_ids,
            frequency: task.frequency,
            completedDates: task.completed_dates.map((d: Date) => d.toISOString().split('T')[0]),
            isCustom: task.is_custom,
            createdBy: task.created_by ? String(task.created_by) : undefined,
            createdAt: task.created_at.toISOString(),
            updatedAt: task.updated_at.toISOString()
          }));

          res.json({
            success: true,
            data: tasks,
            pagination: {
              page: pageNum,
              limit: limitNum,
              total,
              totalPages: Math.ceil(total / limitNum)
            }
          });
        }

      } else if (req.method === 'PUT') {
        const { taskId, childId, title, description, category, difficulty, ageMin, ageMax, duration, knowledgeIds, frequency, completedDates, isCustom } = req.body;

        if (!taskId) {
          res.status(400).json({ success: false, message: 'taskId is required' });
          return;
        }

        if (category && !validCategories.includes(category)) {
          res.status(400).json({ success: false, message: 'Invalid category' });
          return;
        }

        if (difficulty && !validDifficulties.includes(difficulty)) {
          res.status(400).json({ success: false, message: 'Invalid difficulty' });
          return;
        }

        if (frequency && !validFrequencies.includes(frequency)) {
          res.status(400).json({ success: false, message: 'Invalid frequency' });
          return;
        }

        const updates: string[] = [];
        const values: any[] = [];
        let paramIndex = 1;

        if (childId !== undefined) {
          updates.push(`child_id = $${paramIndex++}`);
          values.push(childId);
        }
        if (title !== undefined) {
          updates.push(`title = $${paramIndex++}`);
          values.push(title);
        }
        if (description !== undefined) {
          updates.push(`description = $${paramIndex++}`);
          values.push(description);
        }
        if (category) {
          updates.push(`category = $${paramIndex++}`);
          values.push(category);
        }
        if (difficulty) {
          updates.push(`difficulty = $${paramIndex++}`);
          values.push(difficulty);
        }
        if (ageMin !== undefined) {
          updates.push(`age_min = $${paramIndex++}`);
          values.push(ageMin);
        }
        if (ageMax !== undefined) {
          updates.push(`age_max = $${paramIndex++}`);
          values.push(ageMax);
        }
        if (duration !== undefined) {
          updates.push(`duration = $${paramIndex++}`);
          values.push(duration);
        }
        if (knowledgeIds !== undefined) {
          updates.push(`knowledge_ids = $${paramIndex++}`);
          values.push(knowledgeIds);
        }
        if (frequency) {
          updates.push(`frequency = $${paramIndex++}`);
          values.push(frequency);
        }
        if (completedDates !== undefined) {
          updates.push(`completed_dates = $${paramIndex++}`);
          values.push(completedDates);
        }
        if (isCustom !== undefined) {
          updates.push(`is_custom = $${paramIndex++}`);
          values.push(isCustom);
        }

        if (updates.length === 0) {
          res.status(400).json({ success: false, message: 'No fields to update' });
          return;
        }

        values.push(taskId);

        const updateResult = await client.query(
          `UPDATE tasks SET ${updates.join(', ')}, updated_at = NOW() WHERE id = $${paramIndex} RETURNING id, child_id, title, description, category, difficulty, age_min, age_max, duration, knowledge_ids, frequency, completed_dates, is_custom, created_by, created_at, updated_at`,
          values
        );

        if (updateResult.rows.length === 0) {
          res.status(404).json({ success: false, message: 'Task not found' });
          return;
        }

        const task = updateResult.rows[0];
        const taskResponse = {
          id: String(task.id),
          title: task.title,
          description: task.description,
          category: task.category,
          difficulty: task.difficulty,
          ageRange: { min: task.age_min, max: task.age_max },
          duration: task.duration,
          knowledgeIds: task.knowledge_ids,
          frequency: task.frequency,
          completedDates: task.completed_dates.map((d: Date) => d.toISOString().split('T')[0]),
          isCustom: task.is_custom,
          createdBy: task.created_by ? String(task.created_by) : undefined,
          createdAt: task.created_at.toISOString(),
          updatedAt: task.updated_at.toISOString()
        };

        res.json({
          success: true,
          message: 'Task updated successfully',
          data: taskResponse
        });

      } else if (req.method === 'DELETE') {
        const { taskId } = req.body;

        if (!taskId) {
          res.status(400).json({ success: false, message: 'taskId is required' });
          return;
        }

        const deleteResult = await client.query(
          'DELETE FROM tasks WHERE id = $1',
          [taskId]
        );

        if (deleteResult.rowCount === 0) {
          res.status(404).json({ success: false, message: 'Task not found' });
          return;
        }

        res.json({
          success: true,
          message: 'Task deleted successfully'
        });

      } else {
        res.status(405).json({ success: false, message: 'Method not allowed' });
      }

    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Task operation error:', error);
    res.status(500).json({ success: false, message: 'Task operation failed' });
  }
}
