import { Client } from 'pg';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Método não permitido' });
  }

  const { container, ov } = req.query;

  if (!container && !ov) {
    return res.status(400).json({ error: 'Informe container ou ov para busca.' });
  }

  // Conecta ao banco usando a variável de ambiente segura da Vercel
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
  });

  try {
    await client.connect();

    let queryText = 'SELECT serial, fert, cor, container, ov, lacre FROM sua_tabela WHERE ';
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

    const result = await client.query(queryText, queryParams);
    await client.end();

    return res.status(200).json(result.rows);
  } catch (error) {
    console.error('Erro na consulta:', error);
    return res.status(500).json({ error: 'Erro interno ao consultar o banco de dados.' });
  }
}
