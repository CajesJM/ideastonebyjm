// server/routes/ideas.js
import { Router } from 'express';
import db from '../db.js';

const router = Router();

router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM ideas ORDER BY id DESC');
    return res.json(rows);
  } catch (err) {
    console.error('🔴 Error fetching ideas:', err);    // <-- full error object
    return res.status(500).json({ error: 'Database query failed' });
  }
});

router.post('/', async (req, res) => {
  const { title, description, industry, type, difficulty, roles, technologies } = req.body;
  if (!title || !description) {
    return res.status(400).json({ error: 'Title and description required' });
  }
  try {
    const sql = `
      INSERT INTO ideas
        (title, description, industry, type, difficulty, roles, technologies)
      VALUES (?,?,?,?,?,?,?)
    `;
    const params = [title, description, industry, type, difficulty, roles, technologies];
    const [result] = await db.query(sql, params);
    res.status(201).json({ id: result.insertId, ...req.body });
  } catch {
    res.status(500).json({ error: 'Could not save idea' });
  }
});

export default router; 