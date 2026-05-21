import type { VercelRequest, VercelResponse } from '@vercel/node';
import { Pool } from '@neondatabase/serverless';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

function handleError(res: VercelResponse, error: any, message: string) {
  console.error(`${message}:`, error);
  res.status(500).json({ success: false, error: message, details: String(error) });
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (!process.env.DATABASE_URL) {
    res.status(500).json({ success: false, error: 'Server configuration error' });
    return;
  }

  const client = await pool.connect();
  
  try {
    switch (req.method) {
      case 'GET': {
        const { childId, ageGroup, page = '1', limit = '20' } = req.query;
        
        if (childId) {
          await handleGetMilestones(client, res, childId as string, page as string, limit as string);
        } else {
          await handleGetArticles(client, res, ageGroup as string, page as string, limit as string);
        }
        break;
      }
      
      case 'POST': {
        const { childId, title, date, description, category } = req.body;
        
        if (childId && title && date) {
          await handleCreateMilestone(client, res, req.body);
        } else {
          res.status(400).json({ success: false, error: 'Missing required fields' });
        }
        break;
      }
      
      case 'PUT': {
        const { id, milestoneId, isFavorite, readProgress, ...milestoneUpdates } = req.body;
        
        if (milestoneId || Object.keys(milestoneUpdates).length > 0) {
          await handleUpdateMilestone(client, res, req.body);
        } else if (id && (isFavorite !== undefined || readProgress !== undefined)) {
          await handleUpdateArticle(client, res, req.body);
        } else {
          res.status(400).json({ success: false, error: 'No valid updates provided' });
        }
        break;
      }
      
      case 'DELETE': {
        const { milestoneId } = req.body;
        
        if (milestoneId) {
          await handleDeleteMilestone(client, res, milestoneId);
        } else {
          res.status(400).json({ success: false, error: 'milestoneId is required' });
        }
        break;
      }
      
      default:
        res.status(405).json({ success: false, error: 'Method not allowed' });
    }
  } catch (error) {
    handleError(res, error, 'Knowledge/milestones error');
  } finally {
    client.release();
  }
}

async function handleGetArticles(client: any, res: VercelResponse, ageGroup?: string, page = '1', limit = '20') {
  const offset = (parseInt(page as string) - 1) * parseInt(limit as string);
  
  let query = 'SELECT * FROM knowledge_articles';
  const params: any[] = [];
  const conditions: string[] = [];
  
  if (ageGroup) {
    conditions.push(`age_group = $${params.length + 1}`);
    params.push(ageGroup);
  }
  
  if (conditions.length > 0) {
    query += ' WHERE ' + conditions.join(' AND ');
  }
  
  query += ` ORDER BY created_at DESC LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
  params.push(parseInt(limit as string), offset);
  
  const result = await client.query(query, params);
  
  const articles = result.rows.map((row: any) => ({
    id: String(row.id),
    title: row.title,
    content: row.content,
    ageGroup: row.age_group,
    category: JSON.parse(row.categories || '[]'),
    tags: JSON.parse(row.tags || '[]'),
    source: row.source,
    isFavorite: row.is_favorite || false,
    readProgress: row.read_progress || 0,
    createdAt: row.created_at ? row.created_at.toISOString() : new Date().toISOString(),
    updatedAt: row.updated_at ? row.updated_at.toISOString() : new Date().toISOString()
  }));
  
  res.json({ success: true, data: articles });
}

async function handleUpdateArticle(client: any, res: VercelResponse, body: any) {
  const { id, isFavorite, readProgress } = body;
  
  if (!id) {
    res.status(400).json({ success: false, error: 'ID is required' });
    return;
  }
  
  const updates: string[] = [];
  const params: any[] = [];
  
  if (isFavorite !== undefined) {
    updates.push(`is_favorite = $${params.length + 1}`);
    params.push(isFavorite);
  }
  
  if (readProgress !== undefined) {
    updates.push(`read_progress = $${params.length + 1}`);
    params.push(readProgress);
  }
  
  if (updates.length === 0) {
    res.status(400).json({ success: false, error: 'No updates provided' });
    return;
  }
  
  updates.push('updated_at = NOW()');
  params.push(id);
  
  await client.query(
    `UPDATE knowledge_articles SET ${updates.join(', ')} WHERE id = $${params.length}`,
    params
  );
  
  res.json({ success: true, message: 'Article updated successfully' });
}

async function handleGetMilestones(client: any, res: VercelResponse, childId?: string, page = '1', limit = '20') {
  const offset = (parseInt(page as string) - 1) * parseInt(limit as string);
  
  let query = 'SELECT * FROM milestones WHERE 1=1';
  const params: any[] = [];
  
  if (childId) {
    params.push(parseInt(childId as string));
    query += ` AND child_id = $${params.length}`;
  }
  
  query += ` ORDER BY date DESC LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
  params.push(parseInt(limit as string), offset);
  
  const result = await client.query(query, params);
  
  const milestones = result.rows.map((row: any) => ({
    id: String(row.id),
    childId: String(row.child_id),
    title: row.title,
    date: row.date ? row.date.toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
    description: row.description,
    category: row.category,
    createdAt: row.created_at ? row.created_at.toISOString() : new Date().toISOString(),
    createdBy: row.created_by ? String(row.created_by) : undefined
  }));
  
  res.json({ success: true, data: milestones });
}

async function handleCreateMilestone(client: any, res: VercelResponse, body: any) {
  const { childId, title, date, description, category, createdBy } = body;
  
  const result = await client.query(
    `INSERT INTO milestones (child_id, title, date, description, category, created_by)
     VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
    [childId, title, date, description, category, createdBy]
  );
  
  const row = result.rows[0];
  const milestone = {
    id: String(row.id),
    childId: String(row.child_id),
    title: row.title,
    date: row.date ? row.date.toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
    description: row.description,
    category: row.category,
    createdAt: row.created_at ? row.created_at.toISOString() : new Date().toISOString(),
    createdBy: row.created_by ? String(row.created_by) : undefined
  };
  
  res.status(201).json({ success: true, data: milestone });
}

async function handleUpdateMilestone(client: any, res: VercelResponse, body: any) {
  const { milestoneId, id, title, date, description, category } = body;
  const targetId = milestoneId || id;
  
  if (!targetId) {
    res.status(400).json({ success: false, error: 'milestoneId or id is required' });
    return;
  }
  
  const result = await client.query(
    `UPDATE milestones SET 
      title = COALESCE($1, title),
      date = COALESCE($2, date),
      description = COALESCE($3, description),
      category = COALESCE($4, category)
    WHERE id = $5 RETURNING *`,
    [title, date, description, category, targetId]
  );
  
  if (result.rows.length === 0) {
    res.status(404).json({ success: false, error: 'Milestone not found' });
    return;
  }
  
  const row = result.rows[0];
  const milestone = {
    id: String(row.id),
    childId: String(row.child_id),
    title: row.title,
    date: row.date ? row.date.toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
    description: row.description,
    category: row.category,
    createdAt: row.created_at ? row.created_at.toISOString() : new Date().toISOString(),
    createdBy: row.created_by ? String(row.created_by) : undefined
  };
  
  res.json({ success: true, data: milestone });
}

async function handleDeleteMilestone(client: any, res: VercelResponse, milestoneId: string | number) {
  const result = await client.query('DELETE FROM milestones WHERE id = $1', [milestoneId]);
  
  if (result.rowCount === 0) {
    res.status(404).json({ success: false, error: 'Milestone not found' });
    return;
  }
  
  res.json({ success: true, message: 'Milestone deleted successfully' });
}
