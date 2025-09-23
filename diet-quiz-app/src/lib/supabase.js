import { createClient } from '@supabase/supabase-js'
import { config } from '../config/env.js'

export const supabase = createClient(config.supabase.url, config.supabase.anonKey)

// Funções de autenticação
export const auth = {
  // Cadastro
  async signUp(email, password, userData = {}) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: userData
      }
    })
    return { data, error }
  },

  // Login
  async signIn(email, password) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    })
    return { data, error }
  },

  // Logout
  async signOut() {
    const { error } = await supabase.auth.signOut()
    return { error }
  },

  // Obter usuário atual
  async getCurrentUser() {
    const { data: { user } } = await supabase.auth.getUser()
    return user
  },

  // Salvar dados do quiz
  async saveQuizData(quizData) {
    const { data, error } = await supabase
      .from('quiz_responses')
      .insert([{
        ...quizData,
        created_at: new Date().toISOString()
      }])
    return { data, error }
  },

  // Obter dados do quiz do usuário
  async getQuizData(userId) {
    const { data, error } = await supabase
      .from('quiz_responses')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
    return { data, error }
  }
}
