import { createClient } from '@supabase/supabase-js'

export default async function handler(req, res) {
  // Define o cabeçalho para sempre responder em JSON
  res.setHeader('Content-Type', 'application/json')

  const supabaseUrl = process.env.SUPABASE_URL
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  // Validação das Variáveis de Ambiente
  if (!supabaseUrl || !supabaseServiceKey) {
    return res.status(500).json({ 
      error: 'Variáveis de ambiente ausentes na Vercel. Verifique se SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY foram cadastradas.' 
    })
  }

  try {
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    const { data, error } = await supabase
      .from('b_data')
      .select('*')
      .order('datahora', { ascending: false })
      .limit(100)

    if (error) {
      return res.status(400).json({ error: error.message })
    }

    return res.status(200).json(data)

  } catch (err) {
    return res.status(500).json({ error: err.message || 'Erro interno no servidor' })
  }
}
