// api/consultar.js
import { createClient } from '@supabase/supabase-js'

export default async function handler(req, res) {
  res.setHeader('Content-Type', 'application/json')

  const supabaseUrl = process.env.SUPABASE_URL
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  // 1. Valida se as variáveis existem na Vercel
  if (!supabaseUrl || !supabaseServiceKey) {
    return res.status(500).json({ 
      error: `Variáveis ausentes! SUPABASE_URL: ${supabaseUrl ? 'OK' : 'FALTANDO'} | SERVICE_ROLE_KEY: ${supabaseServiceKey ? 'OK' : 'FALTANDO'}` 
    })
  }

  const { container, ov } = req.query

  if (!container && !ov) {
    return res.status(400).json({ 
      error: 'Informe ao menos um parâmetro de busca: container ou ov.' 
    })
  }

  try {
    // 2. Inicializa o cliente do Supabase
    const supabase = createClient(supabaseUrl.trim(), supabaseServiceKey.trim())

    let query = supabase.from('b_data').select('*')

    if (container) query = query.eq('container', container.trim())
    if (ov) query = query.eq('ov', ov.trim())

    const { data, error } = await query

    // 3. Se o Supabase retornar um erro de autenticação/permissão/tabela
    if (error) {
      return res.status(400).json({ error: `Erro na consulta Supabase: ${error.message}` })
    }

    return res.status(200).json(data)

  } catch (err) {
    // 4. Captura erro exato da conexão HTTP/Node.js
    console.error('Erro de Execução:', err)
    return res.status(500).json({ 
      error: `Erro de conexão: ${err.message || err}` 
    })
  }
}
