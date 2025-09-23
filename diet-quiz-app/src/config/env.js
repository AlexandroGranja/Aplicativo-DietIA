// Configuração de variáveis de ambiente
export const config = {
  supabase: {
    url: import.meta.env.VITE_SUPABASE_URL || 'https://your-project.supabase.co',
    anonKey: import.meta.env.VITE_SUPABASE_ANON_KEY || 'your-anon-key'
  },
  api: {
    url: import.meta.env.VITE_API_URL || 'http://localhost:5000'
  }
}
