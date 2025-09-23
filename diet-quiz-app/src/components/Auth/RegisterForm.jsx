import React, { useState } from 'react'
import { Eye, EyeOff, Mail, Lock, User, UserPlus } from 'lucide-react'
import { auth } from '../../lib/supabase'

const RegisterForm = ({ onRegister, onSwitchToLogin, language }) => {
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const t = {
    pt: {
      title: 'Criar Conta',
      subtitle: 'Cadastre-se para começar sua jornada',
      name: 'Nome Completo',
      username: 'Nome de Usuário',
      email: 'Email (apenas para confirmação)',
      password: 'Senha',
      confirmPassword: 'Confirmar Senha',
      register: 'Criar Conta',
      hasAccount: 'Já tem uma conta?',
      login: 'Entrar',
      loading: 'Criando conta...',
      error: 'Erro ao criar conta. Tente novamente.',
      success: 'Conta criada! Verifique seu email para confirmar.',
      passwordMismatch: 'As senhas não coincidem',
      usernameRequired: 'Nome de usuário é obrigatório',
      usernameMinLength: 'Nome de usuário deve ter pelo menos 3 caracteres'
    },
    en: {
      title: 'Create Account',
      subtitle: 'Sign up to start your journey',
      name: 'Full Name',
      username: 'Username',
      email: 'Email (for confirmation only)',
      password: 'Password',
      confirmPassword: 'Confirm Password',
      register: 'Create Account',
      hasAccount: 'Already have an account?',
      login: 'Sign In',
      loading: 'Creating account...',
      error: 'Error creating account. Please try again.',
      success: 'Account created! Please check your email to confirm.',
      passwordMismatch: 'Passwords do not match',
      usernameRequired: 'Username is required',
      usernameMinLength: 'Username must be at least 3 characters'
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess('')

    if (formData.password !== formData.confirmPassword) {
      setError(t[language].passwordMismatch)
      setLoading(false)
      return
    }

    if (!formData.username || formData.username.length < 3) {
      setError(t[language].usernameMinLength)
      setLoading(false)
      return
    }

    try {
      const { data, error } = await auth.signUp(
        formData.email, 
        formData.password, 
        { 
          name: formData.name,
          username: formData.username 
        }
      )
      
      if (error) {
        setError(t[language].error)
      } else {
        setSuccess(t[language].success)
        
        // Tentar fazer login automaticamente após o cadastro
        setTimeout(async () => {
          try {
            const loginResult = await auth.signIn(formData.email, formData.password)
            if (loginResult.data) {
              onRegister(loginResult.data.user)
            } else {
              // Se não conseguir fazer login, mostrar mensagem para confirmar email
              setSuccess(language === 'pt' ? 'Conta criada! Verifique seu email e faça login.' : 'Account created! Please check your email and login.')
            }
          } catch (loginError) {
            console.log('Login automático falhou, usuário precisa confirmar email')
            setSuccess(language === 'pt' ? 'Conta criada! Verifique seu email e faça login.' : 'Account created! Please check your email and login.')
          }
        }, 2000)
      }
    } catch (err) {
      setError(t[language].error)
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  return (
    <div className="w-full max-w-sm mx-auto">
      <div className="text-center mb-4">
        <div className="mx-auto w-12 h-12 bg-gradient-to-r from-blue-500 to-teal-500 rounded-2xl flex items-center justify-center shadow-lg mb-3">
          <UserPlus className="h-6 w-6 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-1">
          {t[language].title}
        </h2>
        <p className="text-gray-600 dark:text-gray-400 text-sm">
          {t[language].subtitle}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-2">
            <p className="text-red-600 dark:text-red-400 text-xs">{error}</p>
          </div>
        )}

        {success && (
          <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-2">
            <p className="text-green-600 dark:text-green-400 text-xs">{success}</p>
          </div>
        )}

        <div className="space-y-3">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-1">
              <User className="h-3 w-3" />
              {t[language].name}
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full h-9 px-3 py-2 rounded-lg border-2 border-blue-200 dark:border-blue-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-sm"
              placeholder="Seu nome completo"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-1">
              <User className="h-3 w-3" />
              {t[language].username}
            </label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
              minLength={3}
              className="w-full h-9 px-3 py-2 rounded-lg border-2 border-blue-200 dark:border-blue-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-sm"
              placeholder="seu_usuario"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-1">
              <Mail className="h-3 w-3" />
              {t[language].email}
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full h-9 px-3 py-2 rounded-lg border-2 border-blue-200 dark:border-blue-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-sm"
              placeholder="seu@email.com"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-1">
              <Lock className="h-3 w-3" />
              {t[language].password}
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                minLength={6}
                className="w-full h-9 px-3 py-2 pr-10 rounded-lg border-2 border-blue-200 dark:border-blue-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-sm"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-1">
              <Lock className="h-3 w-3" />
              {t[language].confirmPassword}
            </label>
            <div className="relative">
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                className="w-full h-9 px-3 py-2 pr-10 rounded-lg border-2 border-blue-200 dark:border-blue-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-sm"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full h-12 bg-gradient-to-r from-blue-500 to-teal-500 text-white font-semibold rounded-xl shadow-lg hover:from-blue-600 hover:to-teal-600 transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
              {t[language].loading}
            </>
          ) : (
            <>
              <UserPlus className="h-5 w-5" />
              {t[language].register}
            </>
          )}
        </button>

        <div className="text-center">
          <p className="text-gray-600 dark:text-gray-400">
            {t[language].hasAccount}{' '}
            <button
              type="button"
              onClick={onSwitchToLogin}
              className="text-blue-600 dark:text-blue-400 font-semibold hover:underline"
            >
              {t[language].login}
            </button>
          </p>
        </div>
      </form>
    </div>
  )
}

export default RegisterForm
