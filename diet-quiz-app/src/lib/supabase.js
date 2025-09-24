import { createClient } from '@supabase/supabase-js'
import { config } from '../config/env.js'

export const supabase = createClient(config.supabase.url, config.supabase.anonKey)

// Funções de autenticação
export const auth = {
  // Cadastro
  async signUp(email, password, userData = {}) {
    try {
      console.log('🚀 Iniciando cadastro...')
      console.log('📧 Email:', email)
      console.log('👤 Dados do usuário:', userData)
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: userData
        }
      })
      
      console.log('📋 Resposta do signUp:', { data, error })
      
      if (error) {
        console.error('❌ Erro no cadastro:', error)
        return { data: null, error }
      }

      // Se o usuário foi criado com sucesso, criar o perfil com username e email
      if (data && data.user && userData.username) {
        console.log('👤 Criando perfil para usuário:', data.user.id)
        console.log('📝 Dados do perfil:', {
          id: data.user.id,
          full_name: userData.name || '',
          username: userData.username,
          email: email
        })
        
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .insert([{
            id: data.user.id,
            full_name: userData.name || '',
            username: userData.username,
            email: email
          }])
          .select()

        console.log('📋 Resposta do insert profile:', { profileData, profileError })

        if (profileError) {
          console.error('❌ Erro ao criar perfil:', profileError)
          console.error('❌ Detalhes do erro:', JSON.stringify(profileError, null, 2))
          
          // Tentar atualizar se já existir
          const { data: updateData, error: updateError } = await supabase
            .from('profiles')
            .upsert([{
              id: data.user.id,
              full_name: userData.name || '',
              username: userData.username,
              email: email
            }])
            .select()
          
          console.log('📋 Resposta do upsert profile:', { updateData, updateError })
          
          if (updateError) {
            console.error('❌ Erro ao atualizar perfil:', updateError)
            console.error('❌ Detalhes do erro update:', JSON.stringify(updateError, null, 2))
          } else {
            console.log('✅ Perfil atualizado com sucesso!')
          }
        } else {
          console.log('✅ Perfil criado com sucesso!')
        }
      } else {
        console.log('⚠️ Usuário criado mas sem username ou dados incompletos')
        console.log('📋 Data:', data)
        console.log('👤 UserData:', userData)
      }

      return { data, error: null }
    } catch (error) {
      console.error('❌ Erro na autenticação:', error)
      return { data: null, error: { message: 'Erro de conexão' } }
    }
  },

  // Login
  async signIn(email, password) {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      })
      if (error) {
        console.error('Erro no login:', error)
        return { data: null, error }
      }
      return { data, error: null }
    } catch (error) {
      console.error('Erro na autenticação:', error)
      return { data: null, error: { message: 'Erro de conexão' } }
    }
  },

  // Login com username
  async signInWithUsername(username, password) {
    try {
      console.log('🔍 Tentando login com username:', username)
      
      // Buscar o usuário pelo username para obter o email
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('id, full_name, email')
        .eq('username', username)
        .single()

      console.log('📋 Dados do perfil:', profileData)
      console.log('❌ Erro do perfil:', profileError)

      if (profileError || !profileData) {
        console.error('Usuário não encontrado:', profileError)
        return { data: null, error: { message: 'Usuário não encontrado' } }
      }

      if (!profileData.email) {
        console.error('Email não encontrado no perfil')
        return { data: null, error: { message: 'Email não encontrado' } }
      }

      // Fazer login com email e senha
      console.log('🔐 Tentando login com email:', profileData.email)
      const { data, error } = await supabase.auth.signInWithPassword({
        email: profileData.email,
        password
      })

      if (error) {
        console.error('Erro no login:', error)
        return { data: null, error }
      }
      
      console.log('✅ Login realizado com sucesso!')
      return { data, error: null }
    } catch (error) {
      console.error('Erro na autenticação:', error)
      return { data: null, error: { message: 'Erro de conexão' } }
    }
  },

  // Login com email e senha (método tradicional)
  async signInWithEmail(email, password) {
    try {
      console.log('🔍 Tentando login com email:', email)
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      })

      if (error) {
        console.error('Erro no login:', error)
        return { data: null, error }
      }
      
      console.log('✅ Login realizado com sucesso!')
      return { data, error: null }
    } catch (error) {
      console.error('Erro na autenticação:', error)
      return { data: null, error: { message: 'Erro de conexão' } }
    }
  },

  // Login com Google
  async signInWithGoogle() {
    try {
      console.log('🔍 Iniciando login com Google...')
      
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/`
        }
      })

      if (error) {
        console.error('❌ Erro no login com Google:', error)
        return { data: null, error }
      }

      console.log('✅ Redirecionando para Google...')
      return { data, error: null }
    } catch (error) {
      console.error('❌ Erro na autenticação Google:', error)
      return { data: null, error: { message: 'Erro de conexão' } }
    }
  },

  // Criar perfil automaticamente para usuários do Google
  async createProfileForGoogleUser(user) {
    try {
      console.log('👤 Criando perfil para usuário Google:', user.id)
      
      const { data, error } = await supabase
        .from('profiles')
        .insert([{
          id: user.id,
          full_name: user.user_metadata?.full_name || user.user_metadata?.name || '',
          username: user.user_metadata?.username || user.email?.split('@')[0] || '',
          email: user.email
        }])
        .select()

      if (error) {
        console.error('❌ Erro ao criar perfil Google:', error)
        return { data: null, error }
      }

      console.log('✅ Perfil Google criado com sucesso!')
      return { data, error: null }
    } catch (error) {
      console.error('❌ Erro ao criar perfil Google:', error)
      return { data: null, error: { message: 'Erro de conexão' } }
    }
  },

  // Logout
  async signOut() {
    const { error } = await supabase.auth.signOut()
    return { error }
  },

  // Obter usuário atual
  async getCurrentUser() {
    try {
      const { data: { user }, error } = await supabase.auth.getUser()
      if (error) {
        console.error('Erro ao obter usuário:', error)
        return null
      }
      return user
    } catch (error) {
      console.error('Erro na autenticação:', error)
      return null
    }
  },

  // Salvar dados do quiz
  async saveQuizData(quizData) {
    try {
      console.log("🔍 Tentando salvar no Supabase:", quizData);
      
      const { data, error } = await supabase
        .from('quiz_responses')
        .insert([{
          ...quizData,
          created_at: new Date().toISOString()
        }])
      
      if (error) {
        console.error("❌ Erro do Supabase:", error);
        console.error("❌ Código do erro:", error.code);
        console.error("❌ Mensagem:", error.message);
        console.error("❌ Detalhes:", error.details);
        console.error("❌ Hint:", error.hint);
      } else {
        console.log("✅ Dados salvos com sucesso:", data);
      }
      
      return { data, error }
    } catch (err) {
      console.error("❌ Erro na função saveQuizData:", err);
      return { data: null, error: { message: err.message, details: err } }
    }
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
