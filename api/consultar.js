// api/consultar.js
import { createClient } from '@supabase/supabase-js'

export default async function handler(req, res) {
  res.setHeader('Content-Type', 'application/json')

  const supabaseUrl = process.env.SUPABASE_URL
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !supabaseServiceKey) {
    return res.status(500).json({ 
      error: 'Variáveis SUPABASE_URL ou SUPABASE_SERVICE_ROLE_KEY não encontradas na Vercel.' 
    })
  }

  // Pega os parâmetros passados pela URL (ex: /api/consultar?container=ABC ou /api/consultar?ov=123)
  const { container, ov } = req.query

  // Se não passar nem container nem ov, bloqueia para evitar buscar o banco todo
  if (!container && !ov) {
    return res.status(400).json({ 
      error: 'Informe ao menos um parâmetro de consulta: container ou ov.' 
    })
  }

  try {
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Monta a query dinamicamente
    let query = supabase.from('b_data').select('*')

    if (container) {
      query = query.eq('container', container.trim())
    }

    if (ov) {
      query = query.eq('ov', ov.trim())
    }

    const { data, error } = await query

    if (error) {
      return res.status(400).json({ error: error.message })
    }

    return res.status(200).json(data)

  } catch (err) {
    console.error('Erro de conexão:', err)
    return res.status(500).json({ 
      error: 'Falha ao conectar com o Supabase. Verifique a SUPABASE_URL na Vercel.' 
    })
  }
}
