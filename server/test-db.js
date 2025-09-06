// server/test-db.js
import mysql from 'mysql2/promise';
import 'dotenv/config';

console.log('CWD:', process.cwd());
console.log('ENV loaded:', {
  DB_HOST: process.env.DB_HOST,
  DB_USER: process.env.DB_USER,
  DB_PASS: process.env.DB_PASS ? '***' : '(none)',
  DB_NAME: process.env.DB_NAME
});


async function test() {
  try {
    const conn = await mysql.createConnection({
      host:     process.env.DB_HOST,
      port:     process.env.DB_PORT,
      user:     process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME,
    });
    console.log('✅ Connected successfully');
    await conn.end();
  } catch (err) {
    console.error('❌ Connection failed:', err.message);
  }
}

test();