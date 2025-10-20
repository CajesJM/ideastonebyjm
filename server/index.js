//import 'dotenv/config'
import cors from 'cors'
import express from 'express'
import mysql from 'mysql2/promise'

const pool = mysql.createPool({
  host:     process.env.DB_HOST,
  user:     process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
})

const app = express()
app.use(cors())
app.use(express.json())

app.use((req, res, next) => {
  console.log(`➡️  ${req.method} ${req.originalUrl}`);
  next();
});


// ✅ GET: fetch ideas
app.get('/api/ideas', async (req, res) => {
  const { industry, type, difficulty } = req.query;
  console.log('Incoming filters:', req.query);

  let sql    = 'SELECT * FROM ideas WHERE 1=1';
  const ps   = [];

  if (industry) {
    sql += ' AND industry = ?';
    ps.push(industry);
  }
  if (type) {
    sql += ' AND type = ?';
    ps.push(type);
  }
  if (difficulty) {
    sql += ' AND difficulty = ?';
    ps.push(difficulty);
  }

  sql += ' ORDER BY id DESC';
  const [rows] = await pool.query(sql, ps);

  const ideas = rows.map(r => ({
    ...r,
    roles:           JSON.parse(r.roles || '[]'),
    technologies:    JSON.parse(r.technologies || '[]'),
    similarProjects: JSON.parse(r.similarProjects || '[]'),
    duration:        r.duration || null,   // ✅ make sure duration is included
  }));

  console.log('Filtered rows:', ideas);
  res.json(ideas);
});


// ✅ POST: create new idea
app.post('/api/ideas', async (req, res) => {
  const {
    title, description, industry, type,
    difficulty, roles, technologies, similarProjects, duration
  } = req.body

  if (!title || !industry || !type) {
    return res
      .status(400)
      .json({ error: 'Title, industry, and type are required' })
  }

  try {
    const [result] = await pool.query(
      `INSERT INTO ideas
         (title, description, industry, type,
          difficulty, roles, technologies, similarProjects, duration)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        title,
        description || null,
        industry,
        type,
        difficulty || null,
        JSON.stringify(roles || []),
        JSON.stringify(technologies || []),
        JSON.stringify(similarProjects || []),
        duration || null
      ]
    )

    const [newRow] = await pool.query(
      'SELECT * FROM ideas WHERE id = ?',
      [result.insertId]
    )

    const idea = newRow[0]
    idea.roles           = JSON.parse(idea.roles)
    idea.technologies    = JSON.parse(idea.technologies)
    idea.similarProjects = JSON.parse(idea.similarProjects)
    idea.duration        = idea.duration || null

    return res.status(201).json(idea)
  } catch (err) {
    console.error('DB error on POST /api/ideas:', err)
    return res.status(500).json({ error: 'Failed to create idea' })
  }
})

const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`)
})
