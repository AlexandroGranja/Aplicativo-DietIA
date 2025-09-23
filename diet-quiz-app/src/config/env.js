// Configuração de variáveis de ambiente
export const config = {
  supabase: {
    url: import.meta.env.VITE_SUPABASE_URL || 'https://ftqnkqmguwncowpwmlvm.supabase.co',
    anonKey: import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ0cW5rcW1ndXduY293cHdtbHZtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg1ODU1MzIsImV4cCI6MjA3NDE2MTUzMn0.A_8hY7tyg5ZU8VmnMElRkECUzdhhZISpNAnqTj_dw24'
  },
  api: {
    url: import.meta.env.VITE_API_URL || 'http://localhost:5000'
  }
}
