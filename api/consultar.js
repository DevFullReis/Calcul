import pg from 'pg';
const { Pool } = pg;

// Reaproveita o pool de conexões entre chamadas de função
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
  max: 1 // ideal para serverless na Vercel
});

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Método não permitido' });
  }

  const { container, ov } = req.query;

  if (!container && !ov) {
    return res.status(400).json({ error: 'Informe container ou ov para busca.' });
  }

  try {
    let queryText = 'SELECT serial, fert, cor, container, ov, lacre FROM b_data WHERE ';
    const queryParams = [];

    if (container && ov) {
      queryText += 'container = $1 AND ov = $2';
      queryParams.push(container, ov);
    } else if (container) {
      queryText += 'container = $1';
      queryParams.push(container);
    } else {
      queryText += 'ov = $1';
      queryParams.push(ov);
    }

    const result = await pool.query(queryText, queryParams);
    return res.status(200).json(result.rows);
  } catch (error) {
    console.error('Erro na consulta:', error);
    return res.status(500).json({ error: error.message || 'Erro ao consultar o banco de dados.' });
  }
}
