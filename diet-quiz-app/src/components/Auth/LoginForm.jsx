import React, { useState } from 'react'
import { Eye, EyeOff, User, Lock, LogIn } from 'lucide-react'
import { auth } from '../../lib/supabase'

const LoginForm = ({ onLogin, onSwitchToRegister, language }) => {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  })
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const t = {
    pt: {
      title: 'Entrar',
      subtitle: 'Acesse sua conta para continuar',
      username: 'Nome de Usuário',
      password: 'Senha',
      login: 'Entrar',
      noAccount: 'Não tem uma conta?',
      register: 'Cadastre-se',
      loading: 'Entrando...',
      error: 'Erro ao fazer login. Verifique suas credenciais.'
    },
    en: {
      title: 'Sign In',
      subtitle: 'Access your account to continue',
      username: 'Username',
      password: 'Password',
      login: 'Sign In',
      noAccount: "Don't have an account?",
      register: 'Sign Up',
      loading: 'Signing in...',
      error: 'Login error. Please check your credentials.'
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const { data, error } = await auth.signInWithUsername(formData.username, formData.password)
      
      if (error) {
        setError(t[language].error)
      } else {
        onLogin(data.user)
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
          <LogIn className="h-6 w-6 text-white" />
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

        <div className="space-y-3">
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
              className="w-full h-9 px-3 py-2 rounded-lg border-2 border-blue-200 dark:border-blue-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-sm"
              placeholder="seu_usuario"
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
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full h-9 bg-gradient-to-r from-blue-500 to-teal-500 text-white font-semibold rounded-lg shadow-lg hover:from-blue-600 hover:to-teal-600 transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2 text-sm"
        >
          {loading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
              {t[language].loading}
            </>
          ) : (
            <>
              <LogIn className="h-4 w-4" />
              {t[language].login}
            </>
          )}
        </button>

        <div className="text-center">
          <p className="text-gray-600 dark:text-gray-400 text-xs">
            {t[language].noAccount}{' '}
            <button
              type="button"
              onClick={onSwitchToRegister}
              className="text-blue-600 dark:text-blue-400 font-semibold hover:underline"
            >
              {t[language].register}
            </button>
          </p>
        </div>
      </form>
    </div>
  )
}

export default LoginForm
