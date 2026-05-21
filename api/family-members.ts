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
        const { inviteCode, userId, role, nickname } = req.body;

        if (!inviteCode || !userId) {
          res.status(400).json({ error: 'inviteCode and userId are required' });
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

        const familyResult = await client.query(
          'SELECT id, name, invite_code FROM families WHERE invite_code = $1',
          [inviteCode]
        );

        if (familyResult.rows.length === 0) {
          res.status(404).json({ error: 'Family not found' });
          return;
        }

        const family = familyResult.rows[0];

        await client.query('BEGIN');

        try {
          await client.query(
            'UPDATE users SET family_id = $1 WHERE id = $2',
            [family.id, userId]
          );

          const memberResult = await client.query(
            'INSERT INTO family_members (family_id, user_id, username, role, nickname, joined_at) VALUES ($1, $2, $3, $4, $5, NOW()) RETURNING id, username, role, nickname, avatar, joined_at',
            [family.id, userId, user.username, role || 'other', nickname]
          );
          const member = memberResult.rows[0];

          await client.query(
            'UPDATE users SET current_member_id = $1 WHERE id = $2',
            [member.id, userId]
          );

          await client.query('COMMIT');

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
            message: 'Joined family successfully',
            member: memberResponse,
            family: {
              id: String(family.id),
              name: family.name,
              inviteCode: family.invite_code
            }
          });
        } catch (error) {
          await client.query('ROLLBACK');
          throw error;
        }

      } else if (req.method === 'GET') {
        const { memberId, familyId } = req.query;

        if (memberId) {
          const memberResult = await client.query(
            'SELECT id, username, role, nickname, avatar, joined_at FROM family_members WHERE id = $1',
            [memberId]
          );

          if (memberResult.rows.length === 0) {
            res.status(404).json({ error: 'Member not found' });
            return;
          }

          const member = memberResult.rows[0];
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
            member: memberResponse
          });

        } else if (familyId) {
          const membersResult = await client.query(
            'SELECT id, username, role, nickname, avatar, joined_at FROM family_members WHERE family_id = $1',
            [familyId]
          );

          const members = membersResult.rows.map(member => ({
            id: String(member.id),
            username: member.username,
            role: member.role,
            nickname: member.nickname,
            avatar: member.avatar,
            joinedAt: member.joined_at.toISOString()
          }));

          res.json({
            success: true,
            members
          });

        } else {
          res.status(400).json({ error: 'Either memberId or familyId is required' });
        }

      } else if (req.method === 'PUT') {
        const { memberId, role, nickname, avatar } = req.body;

        if (!memberId) {
          res.status(400).json({ error: 'memberId is required' });
          return;
        }

        const updates: string[] = [];
        const values: any[] = [];
        let paramIndex = 1;

        if (role) {
          updates.push(`role = $${paramIndex++}`);
          values.push(role);
        }
        if (nickname !== undefined) {
          updates.push(`nickname = $${paramIndex++}`);
          values.push(nickname);
        }
        if (avatar !== undefined) {
          updates.push(`avatar = $${paramIndex++}`);
          values.push(avatar);
        }

        if (updates.length === 0) {
          res.status(400).json({ error: 'No fields to update' });
          return;
        }

        values.push(memberId);

        const updateResult = await client.query(
          `UPDATE family_members SET ${updates.join(', ')}, updated_at = NOW() WHERE id = $${paramIndex} RETURNING id, username, role, nickname, avatar, joined_at`,
          values
        );

        if (updateResult.rows.length === 0) {
          res.status(404).json({ error: 'Member not found' });
          return;
        }

        const member = updateResult.rows[0];
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
          message: 'Member updated successfully',
          member: memberResponse
        });

      } else if (req.method === 'DELETE') {
        const { memberId, userId } = req.body;

        if (!memberId || !userId) {
          res.status(400).json({ error: 'memberId and userId are required' });
          return;
        }

        const memberResult = await client.query(
          'SELECT id, user_id, family_id FROM family_members WHERE id = $1',
          [memberId]
        );

        if (memberResult.rows.length === 0) {
          res.status(404).json({ error: 'Member not found' });
          return;
        }

        const member = memberResult.rows[0];

        if (String(member.user_id) !== String(userId)) {
          res.status(403).json({ error: 'Not authorized to remove this member' });
          return;
        }

        await client.query('BEGIN');

        try {
          await client.query(
            'UPDATE users SET family_id = NULL, current_member_id = NULL WHERE id = $1',
            [member.user_id]
          );

          await client.query(
            'DELETE FROM family_members WHERE id = $1',
            [memberId]
          );

          await client.query('COMMIT');

          res.json({
            success: true,
            message: 'Member removed from family successfully'
          });
        } catch (error) {
          await client.query('ROLLBACK');
          throw error;
        }

      } else {
        res.status(405).json({ error: 'Method not allowed' });
      }

    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Family member operation error:', error);
    res.status(500).json({ error: 'Family member operation failed' });
  }
}
