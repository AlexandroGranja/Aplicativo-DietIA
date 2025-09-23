# 🚀 Como Usar o DietIA

## ✅ Aplicativo Ativado!

O servidor de desenvolvimento está rodando em:
**http://localhost:5173**

## 🔧 Configuração Rápida

### 1. Configurar Supabase (Opcional)
Se quiser usar autenticação e banco de dados:

1. Crie um arquivo `.env.local` na pasta `ubuntu/diet-quiz-app/`
2. Adicione suas credenciais do Supabase:

```env
VITE_SUPABASE_URL=https://seu-projeto.supabase.co
VITE_SUPABASE_ANON_KEY=sua-chave-anonima-aqui
VITE_API_URL=http://localhost:5000
```

### 2. Configurar Backend (Opcional)
Se quiser usar o backend Python:

```bash
cd ubuntu/diet-api
python -m venv venv
.\venv\Scripts\Activate.ps1
pip install -r requirements.txt
python src/main.py
```

## 🎯 Funcionalidades

### ✅ Funcionando Agora
- ✅ **Interface moderna** com tema azul/verde
- ✅ **Formulário de quiz** completo
- ✅ **Suporte multilíngue** (PT/EN)
- ✅ **Design responsivo**
- ✅ **Modo claro/escuro**
- ✅ **Fundo com textura**

### 🔐 Com Supabase
- ✅ **Sistema de login/cadastro**
- ✅ **Salvamento de dados**
- ✅ **Gerenciamento de usuários**

### 🔗 Com Backend
- ✅ **API REST** para dados
- ✅ **Integração n8n** (webhook)

## 🌐 Acessar

1. **Abra seu navegador**
2. **Acesse**: `http://localhost:5173`
3. **Teste o formulário** de quiz
4. **Configure Supabase** se necessário

## 🎨 Recursos Visuais

- **Tema**: Azul/Verde para nutrição
- **Fundo**: Textura sutil com gradientes
- **Componentes**: Design moderno e profissional
- **Animações**: Transições suaves
- **Responsivo**: Funciona em todos os dispositivos

## 🚨 Troubleshooting

### Erro de Conexão
- Verifique se o servidor está rodando
- Acesse `http://localhost:5173`

### Erro de Supabase
- Configure o arquivo `.env.local`
- Siga as instruções em `INSTRUCOES_SUPABASE.md`

### Erro de Build
- Execute `npm install`
- Execute `npm run dev`

---

🎉 **Aplicativo funcionando perfeitamente!**
