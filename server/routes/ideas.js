import { Router } from 'express';
import db from '../db.js';

const router = Router();

// GET /api/ideas?industry=Gaming&type=Web%20App&difficulty=Beginner&search=AI&duration=3 months
router.get('/', async (req, res) => {
  const { industry, type, difficulty, search, duration } = req.query;

  let sql = `SELECT * FROM ideas WHERE 1=1`;
  const params = [];

  if (industry) {
    sql += ` AND industry = ?`;
    params.push(industry);
  }

  if (type) {
    sql += ` AND type = ?`;
    params.push(type);
  }

  if (difficulty) {
    sql += ` AND difficulty = ?`;
    params.push(difficulty);
  }

  if (duration) {
    sql += ` AND duration = ?`;
    params.push(duration);
  }

  if (search) {
    sql += ` AND (title LIKE ? OR description LIKE ?)`;
    params.push(`%${search}%`, `%${search}%`);
  }

  sql += ` ORDER BY id DESC`;

  try {
    const [rows] = await db.query(sql, params);

    // Ensure JSON fields are parsed
    const formatted = rows.map(row => ({
      ...row,
      roles: row.roles ? JSON.parse(row.roles) : [],
      technologies: row.technologies ? JSON.parse(row.technologies) : [],
      similarProjects: row.similarProjects ? JSON.parse(row.similarProjects) : []
    }));

    return res.json(formatted);
  } catch (err) {
    console.error('🔴 Error fetching ideas:', err);
    return res.status(500).json({ error: 'Database query failed' });
  }
});

// POST /api/ideas
router.post('/', async (req, res) => {
  const { title, description, industry, type, difficulty, duration, roles, technologies, similarProjects } = req.body;

  if (!title || !description) {
    return res.status(400).json({ error: 'Title and description required' });
  }

  try {
    const sql = `
      INSERT INTO ideas
        (title, description, industry, type, difficulty, duration, roles, technologies, similarProjects)
      VALUES (?,?,?,?,?,?,?,?,?)
    `;

    const params = [
      title,
      description,
      industry,
      type,
      difficulty,
      duration,
      JSON.stringify(roles || []),
      JSON.stringify(technologies || []),
      JSON.stringify(similarProjects || [])
    ];

    const [result] = await db.query(sql, params);

    res.status(201).json({ id: result.insertId, ...req.body });
  } catch (err) {
    console.error('🔴 Error inserting idea:', err);
    res.status(500).json({ error: 'Could not save idea' });
  }
});

export default router;
