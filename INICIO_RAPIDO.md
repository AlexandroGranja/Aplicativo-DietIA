# 🚀 Início Rápido - DietIA

## ⚡ Executar em 2 Minutos

### 1. Frontend (Obrigatório)
```bash
cd diet-quiz-app
npm install
npm run dev
```
**Acesse**: `http://localhost:5173`

### 2. Backend (Opcional)
```bash
cd diet-api
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
python src/main.py
```

### 3. Supabase (Opcional - Para autenticação)
1. Crie projeto no [Supabase](https://supabase.com)
2. Crie arquivo `.env.local` em `diet-quiz-app/`:
```env
VITE_SUPABASE_URL=https://seu-projeto.supabase.co
VITE_SUPABASE_ANON_KEY=sua-chave-anonima-aqui
```
3. Execute scripts SQL em `INSTRUCOES_SUPABASE.md`

## 🎯 O que Você Terá

### ✅ Sem Configuração
- Interface moderna azul/verde
- Formulário de quiz completo
- Suporte multilíngue (PT/EN)
- Design responsivo
- Modo claro/escuro

### ✅ Com Supabase
- Sistema de login/cadastro
- Salvamento de dados
- Gerenciamento de usuários

### ✅ Com Backend
- API REST completa
- Integração n8n
- Processamento de dados

## 📁 Estrutura do Projeto

```
Aplicativo-DietIA-1/
├── diet-quiz-app/          # Frontend React
├── diet-api/               # Backend Python
├── venv/                   # Ambiente Python
├── README.md               # Documentação completa
├── INSTRUCOES_SUPABASE.md  # Guia Supabase
├── COMO_USAR.md           # Guia detalhado
└── INICIO_RAPIDO.md       # Este arquivo
```

## 🔧 Troubleshooting

### Erro de Porta
- Verifique se a porta 5173 está livre
- Use `netstat -an | findstr :5173`

### Erro de Dependências
- Execute `npm install` no diretório correto
- Verifique se está em `diet-quiz-app/`

### Erro de Supabase
- Verifique as credenciais no `.env.local`
- Siga `INSTRUCOES_SUPABASE.md`

## 📞 Suporte

- **Documentação completa**: `README.md`
- **Guia Supabase**: `INSTRUCOES_SUPABASE.md`
- **Guia detalhado**: `COMO_USAR.md`

---

🎉 **Pronto! Seu DietIA está funcionando!**
