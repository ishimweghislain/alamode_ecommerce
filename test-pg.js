
const { Pool } = require('pg');
require('dotenv').config();

const connectionString = process.env.DATABASE_URL;

const pool = new Pool({
    connectionString,
    ssl: { rejectUnauthorized: false }
});

async function test() {
    console.log('Testing PG direct connection...');
    try {
        const client = await pool.connect();
        console.log('--- SUCCESS! Connected to PG ---');
        const res = await client.query('SELECT NOW()');
        console.log('Server time:', res.rows[0]);
        client.release();
    } catch (err) {
        console.error('--- FAILURE ---');
        console.error(err);
    } finally {
        await pool.end();
    }
}

test();
