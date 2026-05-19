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
        const { childId, measurementId, page = '1', limit = '20', type } = req.query;
        
        if (measurementId) {
          await handleGetMeasurement(client, res, measurementId);
        } else if (childId && type === 'measurements') {
          const result = await client.query(
            'SELECT * FROM growth_measurements WHERE child_id = $1 ORDER BY date ASC',
            [childId]
          );
          
          const measurements = result.rows.map((row: any) => ({
            id: String(row.id),
            childId: String(row.child_id),
            date: row.date ? row.date.toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
            ageMonths: row.age_months,
            height: row.height,
            weight: row.weight,
            headCircumference: row.head_circumference,
            createdAt: row.created_at ? row.created_at.toISOString() : new Date().toISOString(),
            createdBy: row.created_by ? String(row.created_by) : undefined
          }));
          
          res.json({ success: true, data: measurements });
        } else if (childId) {
          const result = await client.query(
            'SELECT * FROM emotion_records WHERE child_id = $1 ORDER BY date DESC LIMIT $2 OFFSET $3',
            [childId, parseInt(limit as string), (parseInt(page as string) - 1) * parseInt(limit as string)]
          );
          
          const emotions = result.rows.map((row: any) => ({
            id: String(row.id),
            childId: String(row.child_id),
            date: row.date ? row.date.toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
            emotion: row.emotion,
            trigger: row.trigger,
            response: row.response,
            notes: row.notes,
            createdAt: row.created_at ? row.created_at.toISOString() : new Date().toISOString(),
            createdBy: row.created_by ? String(row.created_by) : undefined
          }));
          
          res.json({ success: true, data: emotions });
        } else {
          res.status(400).json({ success: false, error: 'childId is required' });
        }
        break;
      }
      
      case 'POST': {
        const { childId, date, emotion, trigger, response, notes, ageMonths, height, weight, headCircumference, createdBy } = req.body;
        
        if (ageMonths !== undefined && height !== undefined && weight !== undefined) {
          await handleCreateMeasurement(client, res, req.body);
        } else if (childId && date && emotion) {
          await handleCreateEmotion(client, res, req.body);
        } else {
          res.status(400).json({ success: false, error: 'Missing required fields' });
        }
        break;
      }
      
      case 'PUT': {
        const { recordId, measurementId, ...updates } = req.body;
        
        if (measurementId) {
          await handleUpdateMeasurement(client, res, req.body);
        } else if (recordId) {
          await handleUpdateEmotion(client, res, req.body);
        } else {
          res.status(400).json({ success: false, error: 'recordId or measurementId is required' });
        }
        break;
      }
      
      case 'DELETE': {
        const { recordId, measurementId } = req.body;
        
        if (measurementId) {
          await handleDeleteMeasurement(client, res, measurementId);
        } else if (recordId) {
          await handleDeleteEmotion(client, res, recordId);
        } else {
          res.status(400).json({ success: false, error: 'recordId or measurementId is required' });
        }
        break;
      }
      
      default:
        res.status(405).json({ success: false, error: 'Method not allowed' });
    }
  } catch (error) {
    handleError(res, error, 'Emotions/measurements error');
  } finally {
    client.release();
  }
}

async function handleCreateEmotion(client: any, res: VercelResponse, body: any) {
  const { childId, date, emotion, trigger, response, notes, createdBy } = body;
  
  const result = await client.query(
    `INSERT INTO emotion_records (child_id, date, emotion, trigger, response, notes, created_by)
     VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
    [childId, date, emotion, trigger, response, notes, createdBy]
  );
  
  const row = result.rows[0];
  const emotionRecord = {
    id: String(row.id),
    childId: String(row.child_id),
    date: row.date ? row.date.toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
    emotion: row.emotion,
    trigger: row.trigger,
    response: row.response,
    notes: row.notes,
    createdAt: row.created_at ? row.created_at.toISOString() : new Date().toISOString(),
    createdBy: row.created_by ? String(row.created_by) : undefined
  };
  
  res.status(201).json({ success: true, data: emotionRecord });
}

async function handleUpdateEmotion(client: any, res: VercelResponse, body: any) {
  const { recordId, emotion, trigger, response, notes } = body;
  
  const result = await client.query(
    `UPDATE emotion_records SET 
      emotion = COALESCE($1, emotion),
      trigger = COALESCE($2, trigger),
      response = COALESCE($3, response),
      notes = COALESCE($4, notes)
    WHERE id = $5 RETURNING *`,
    [emotion, trigger, response, notes, recordId]
  );
  
  if (result.rows.length === 0) {
    res.status(404).json({ success: false, error: 'Record not found' });
    return;
  }
  
  const row = result.rows[0];
  const emotionRecord = {
    id: String(row.id),
    childId: String(row.child_id),
    date: row.date ? row.date.toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
    emotion: row.emotion,
    trigger: row.trigger,
    response: row.response,
    notes: row.notes,
    createdAt: row.created_at ? row.created_at.toISOString() : new Date().toISOString(),
    createdBy: row.created_by ? String(row.created_by) : undefined
  };
  
  res.json({ success: true, data: emotionRecord });
}

async function handleDeleteEmotion(client: any, res: VercelResponse, recordId: string | number) {
  const result = await client.query('DELETE FROM emotion_records WHERE id = $1', [recordId]);
  
  if (result.rowCount === 0) {
    res.status(404).json({ success: false, error: 'Record not found' });
    return;
  }
  
  res.json({ success: true, message: 'Record deleted successfully' });
}

async function handleGetMeasurement(client: any, res: VercelResponse, measurementId: string) {
  const result = await client.query(
    'SELECT * FROM growth_measurements WHERE id = $1',
    [measurementId]
  );
  
  if (result.rows.length === 0) {
    res.status(404).json({ success: false, error: 'Measurement not found' });
    return;
  }
  
  const row = result.rows[0];
  const measurement = {
    id: String(row.id),
    childId: String(row.child_id),
    date: row.date ? row.date.toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
    ageMonths: row.age_months,
    height: row.height,
    weight: row.weight,
    headCircumference: row.head_circumference,
    createdAt: row.created_at ? row.created_at.toISOString() : new Date().toISOString(),
    createdBy: row.created_by ? String(row.created_by) : undefined
  };
  
  res.json({ success: true, data: measurement });
}

async function handleCreateMeasurement(client: any, res: VercelResponse, body: any) {
  const { childId, date, ageMonths, height, weight, headCircumference, createdBy } = body;
  
  const result = await client.query(
    `INSERT INTO growth_measurements (child_id, date, age_months, height, weight, head_circumference, created_by)
     VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
    [childId, date, ageMonths, height, weight, headCircumference, createdBy]
  );
  
  const row = result.rows[0];
  const measurement = {
    id: String(row.id),
    childId: String(row.child_id),
    date: row.date ? row.date.toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
    ageMonths: row.age_months,
    height: row.height,
    weight: row.weight,
    headCircumference: row.head_circumference,
    createdAt: row.created_at ? row.created_at.toISOString() : new Date().toISOString(),
    createdBy: row.created_by ? String(row.created_by) : undefined
  };
  
  res.status(201).json({ success: true, data: measurement });
}

async function handleUpdateMeasurement(client: any, res: VercelResponse, body: any) {
  const { measurementId, date, ageMonths, height, weight, headCircumference } = body;
  
  const result = await client.query(
    `UPDATE growth_measurements SET 
      date = COALESCE($1, date),
      age_months = COALESCE($2, age_months),
      height = COALESCE($3, height),
      weight = COALESCE($4, weight),
      head_circumference = COALESCE($5, head_circumference)
    WHERE id = $6 RETURNING *`,
    [date, ageMonths, height, weight, headCircumference, measurementId]
  );
  
  if (result.rows.length === 0) {
    res.status(404).json({ success: false, error: 'Measurement not found' });
    return;
  }
  
  const row = result.rows[0];
  const measurement = {
    id: String(row.id),
    childId: String(row.child_id),
    date: row.date ? row.date.toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
    ageMonths: row.age_months,
    height: row.height,
    weight: row.weight,
    headCircumference: row.head_circumference,
    createdAt: row.created_at ? row.created_at.toISOString() : new Date().toISOString(),
    createdBy: row.created_by ? String(row.created_by) : undefined
  };
  
  res.json({ success: true, data: measurement });
}

async function handleDeleteMeasurement(client: any, res: VercelResponse, measurementId: string | number) {
  const result = await client.query('DELETE FROM growth_measurements WHERE id = $1', [measurementId]);
  
  if (result.rowCount === 0) {
    res.status(404).json({ success: false, error: 'Measurement not found' });
    return;
  }
  
  res.json({ success: true, message: 'Measurement deleted successfully' });
}
