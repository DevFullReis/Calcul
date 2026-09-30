// api/consultar.js
import { createClient } from '@supabase/supabase-js'

export default async function handler(req, res) {
  // A Vercel vai injetar automaticamente as variáveis que configurou no painel
  const supabaseUrl = process.env.SUPABASE_URL
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !supabaseServiceKey) {
    return res.status(500).json({ error: 'Variáveis de ambiente não encontradas na Vercel.' })
  }

  // Inicializa o cliente com a chave secreta de serviço
  const supabase = createClient(supabaseUrl, supabaseServiceKey)

  try {
    // Consulta a tabela b_data ignorando as regras de RLS
    const { data, error } = await supabase
      .from('b_data')
      .select('*')
      .order('datahora', { ascending: false })
      .limit(100)

    if (error) {
      throw error
    }

    return res.status(200).json(data)
  } catch (err) {
    console.error('Erro no servidor:', err)
    return res.status(500).json({ error: err.message })
  }
}
