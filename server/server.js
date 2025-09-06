// server/server.js
import dotenv from 'dotenv';
dotenv.config();

console.log('DB HOST →', process.env.DB_HOST);
console.log('DB USER →', process.env.DB_USER);
console.log('DB PASS →', process.env.DB_PASS ? '***' : '(undefined)');
console.log('DB NAME →', process.env.DB_NAME);


import express from 'express';
import cors from 'cors';
import ideasRouter from './routes/ideas.js';

const app = express();
app.use(cors());
app.use(express.json());
app.use('/api/ideas', ideasRouter);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`🚀 Backend listening on http://localhost:${PORT}`)
);