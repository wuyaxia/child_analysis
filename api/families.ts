import type { VercelRequest, VercelResponse } from '@vercel/node';
import { Pool } from '@neondatabase/serverless';
import crypto from 'crypto';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

function generateInviteCode(): string {
  return crypto.randomBytes(4).toString('hex').toUpperCase();
}

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
        const { name, userId } = req.body;

        if (!name || !userId) {
          res.status(400).json({ error: 'Name and userId are required' });
          return;
        }

        const userResult = await client.query(
          'SELECT id, username FROM users WHERE id = $1',
          [userId]
        );

        if (userResult.rows.length === 0) {
          res.status(404).json({ error: 'User not found' });
          return;
        }

        const user = userResult.rows[0];

        if (user.family_id) {
          res.status(400).json({ error: 'User already in a family' });
          return;
        }

        let inviteCode = generateInviteCode();
        let attempts = 0;
        while (attempts < 10) {
          const checkResult = await client.query(
            'SELECT id FROM families WHERE invite_code = $1',
            [inviteCode]
          );
          if (checkResult.rows.length === 0) break;
          inviteCode = generateInviteCode();
          attempts++;
        }

        await client.query('BEGIN');

        try {
          const familyResult = await client.query(
            'INSERT INTO families (name, invite_code, created_at) VALUES ($1, $2, NOW()) RETURNING id, name, invite_code, created_at',
            [name, inviteCode]
          );
          const family = familyResult.rows[0];

          await client.query(
            'UPDATE users SET family_id = $1 WHERE id = $2',
            [family.id, userId]
          );

          const memberResult = await client.query(
            'INSERT INTO family_members (family_id, user_id, username, role, joined_at) VALUES ($1, $2, $3, $4, NOW()) RETURNING id, username, role, nickname, avatar, joined_at',
            [family.id, userId, user.username, 'other']
          );
          const member = memberResult.rows[0];

          await client.query(
            'UPDATE users SET current_member_id = $1 WHERE id = $2',
            [member.id, userId]
          );

          await client.query('COMMIT');

          const familyResponse = {
            id: String(family.id),
            name: family.name,
            inviteCode: family.invite_code,
            createdAt: family.created_at.toISOString()
          };

          const memberResponse = {
            id: String(member.id),
            username: member.username,
            role: member.role,
            nickname: member.nickname,
            avatar: member.avatar,
            joinedAt: member.joined_at.toISOString()
          };

          res.json({
            success: true,
            message: 'Family created successfully',
            family: familyResponse,
            member: memberResponse
          });
        } catch (error) {
          await client.query('ROLLBACK');
          throw error;
        }

      } else if (req.method === 'GET') {
        const { familyId, inviteCode } = req.query;

        if (inviteCode) {
          const familyResult = await client.query(
            'SELECT id, name, invite_code, created_at FROM families WHERE invite_code = $1',
            [inviteCode]
          );

          if (familyResult.rows.length === 0) {
            res.status(404).json({ error: 'Family not found' });
            return;
          }

          const family = familyResult.rows[0];

          const membersResult = await client.query(
            'SELECT id, username, role, nickname, avatar, joined_at FROM family_members WHERE family_id = $1',
            [family.id]
          );

          const members = membersResult.rows.map(member => ({
            id: String(member.id),
            username: member.username,
            role: member.role,
            nickname: member.nickname,
            avatar: member.avatar,
            joinedAt: member.joined_at.toISOString()
          }));

          const familyResponse = {
            id: String(family.id),
            name: family.name,
            inviteCode: family.invite_code,
            createdAt: family.created_at.toISOString(),
            members
          };

          res.json({
            success: true,
            family: familyResponse
          });

        } else if (familyId) {
          const familyResult = await client.query(
            'SELECT id, name, invite_code, created_at FROM families WHERE id = $1',
            [familyId]
          );

          if (familyResult.rows.length === 0) {
            res.status(404).json({ error: 'Family not found' });
            return;
          }

          const family = familyResult.rows[0];

          const membersResult = await client.query(
            'SELECT id, username, role, nickname, avatar, joined_at FROM family_members WHERE family_id = $1',
            [family.id]
          );

          const members = membersResult.rows.map(member => ({
            id: String(member.id),
            username: member.username,
            role: member.role,
            nickname: member.nickname,
            avatar: member.avatar,
            joinedAt: member.joined_at.toISOString()
          }));

          const childrenResult = await client.query(
            'SELECT id, name, birth_date, gender, avatar, order_index, is_active, created_by, created_at, updated_at FROM children WHERE family_id = $1',
            [family.id]
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

          const familyResponse = {
            id: String(family.id),
            name: family.name,
            inviteCode: family.invite_code,
            createdAt: family.created_at.toISOString(),
            members,
            children
          };

          res.json({
            success: true,
            family: familyResponse
          });

        } else {
          res.status(400).json({ error: 'Either familyId or inviteCode is required' });
        }

      } else {
        res.status(405).json({ error: 'Method not allowed' });
      }

    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Family operation error:', error);
    res.status(500).json({ error: 'Family operation failed' });
  }
}
