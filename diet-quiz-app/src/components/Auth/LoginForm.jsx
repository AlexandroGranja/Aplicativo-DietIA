import React, { useState } from 'react'
import { Eye, EyeOff, User, Lock, LogIn } from 'lucide-react'
import { auth } from '../../lib/supabase'

const LoginForm = ({ onLogin, onSwitchToRegister, language }) => {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  })
  const [loginMethod, setLoginMethod] = useState('username') // 'username' ou 'email'
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const t = {
    pt: {
      title: 'Entrar',
      subtitle: 'Acesse sua conta para continuar',
      username: 'Nome de Usuário',
      email: 'Email',
      password: 'Senha',
      login: 'Entrar',
      noAccount: 'Não tem uma conta?',
      register: 'Cadastre-se',
      loading: 'Entrando...',
      error: 'Erro ao fazer login. Verifique suas credenciais.',
      switchToEmail: 'Usar email',
      switchToUsername: 'Usar nome de usuário'
    },
    en: {
      title: 'Sign In',
      subtitle: 'Access your account to continue',
      username: 'Username',
      email: 'Email',
      password: 'Password',
      login: 'Sign In',
      noAccount: "Don't have an account?",
      register: 'Sign Up',
      loading: 'Signing in...',
      error: 'Login error. Please check your credentials.',
      switchToEmail: 'Use email',
      switchToUsername: 'Use username'
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      let result
      
      if (loginMethod === 'username') {
        result = await auth.signInWithUsername(formData.username, formData.password)
      } else {
        result = await auth.signInWithEmail(formData.username, formData.password)
      }
      
      if (result.error) {
        setError(result.error.message)
      } else {
        onLogin(result.data.user)
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
          {/* Seletor de método de login */}
          <div className="flex space-x-2 mb-2">
            <button
              type="button"
              onClick={() => setLoginMethod('username')}
              className={`px-3 py-1 text-xs rounded-md transition-colors ${
                loginMethod === 'username'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
              }`}
            >
              {t[language].switchToUsername}
            </button>
            <button
              type="button"
              onClick={() => setLoginMethod('email')}
              className={`px-3 py-1 text-xs rounded-md transition-colors ${
                loginMethod === 'email'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
              }`}
            >
              {t[language].switchToEmail}
            </button>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-1">
              <User className="h-3 w-3" />
              {loginMethod === 'username' ? t[language].username : t[language].email}
            </label>
            <input
              type={loginMethod === 'email' ? 'email' : 'text'}
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
              className="w-full h-9 px-3 py-2 rounded-lg border-2 border-blue-200 dark:border-blue-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-sm"
              placeholder={loginMethod === 'username' ? 'seu_usuario' : 'seu@email.com'}
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

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300 dark:border-gray-600" />
          </div>
          <div className="relative flex justify-center text-xs">
            <span className="px-2 bg-white dark:bg-gray-900 text-gray-500">ou</span>
          </div>
        </div>

        <button
          type="button"
          onClick={() => auth.signInWithGoogle()}
          className="w-full h-9 bg-white dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-semibold rounded-lg shadow-lg hover:bg-gray-50 dark:hover:bg-gray-700 transform hover:scale-105 transition-all duration-200 flex items-center justify-center gap-2 text-sm"
        >
          <svg className="h-4 w-4" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          {language === 'pt' ? 'Entrar com Google' : 'Sign in with Google'}
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
