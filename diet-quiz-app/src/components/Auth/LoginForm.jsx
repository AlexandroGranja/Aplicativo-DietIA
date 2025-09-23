import React, { useState } from 'react'
import { Eye, EyeOff, Mail, Lock, LogIn } from 'lucide-react'
import { auth } from '../../lib/supabase'

const LoginForm = ({ onLogin, onSwitchToRegister, language }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const t = {
    pt: {
      title: 'Entrar',
      subtitle: 'Acesse sua conta para continuar',
      email: 'Email',
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
      email: 'Email',
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
      const { data, error } = await auth.signIn(formData.email, formData.password)
      
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
    <div className="w-full max-w-md mx-auto">
      <div className="text-center mb-8">
        <div className="mx-auto w-16 h-16 bg-gradient-to-r from-blue-500 to-teal-500 rounded-2xl flex items-center justify-center shadow-lg mb-4">
          <LogIn className="h-8 w-8 text-white" />
        </div>
        <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">
          {t[language].title}
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          {t[language].subtitle}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4">
            <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>
          </div>
        )}

        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
              <Mail className="h-4 w-4" />
              {t[language].email}
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full h-12 px-4 py-3 rounded-xl border-2 border-blue-200 dark:border-blue-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
              placeholder="seu@email.com"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
              <Lock className="h-4 w-4" />
              {t[language].password}
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                className="w-full h-12 px-4 py-3 pr-12 rounded-xl border-2 border-blue-200 dark:border-blue-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
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
              <LogIn className="h-5 w-5" />
              {t[language].login}
            </>
          )}
        </button>

        <div className="text-center">
          <p className="text-gray-600 dark:text-gray-400">
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
