# 🔥 Criar Arquivo .env.local para Supabase

## 📝 Instruções

### 1. Criar o Arquivo
1. Navegue até a pasta `diet-quiz-app/`
2. Crie um novo arquivo chamado `.env.local`
3. Cole o conteúdo abaixo no arquivo:

### 2. Conteúdo do Arquivo .env.local

```env
# Configuração do Supabase - DietIA
VITE_SUPABASE_URL=https://ftqnkqmguwncowpwmlvm.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ0cW5rcW1ndXduY293cHdtbHZtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg1ODU1MzIsImV4cCI6MjA3NDE2MTUzMn0.AxcjHo3_m3tpueyUvlaKdRPuvi8-DXZvRMydZ1GyVkI

# URL da API local (opcional)
VITE_API_URL=http://localhost:5000
```

### 3. Localização do Arquivo
```
Aplicativo-DietIA-1/
└── diet-quiz-app/
    ├── .env.local          ← CRIAR AQUI
    ├── package.json
    ├── src/
    └── ...
```

### 4. Verificar se Funcionou
Após criar o arquivo, execute:
```bash
cd diet-quiz-app
npm run dev
```

### 5. Testar Supabase
1. Acesse `http://localhost:5173`
2. Teste o cadastro/login
3. Preencha o quiz
4. Verifique os dados no Supabase

## ✅ Pronto!

Com este arquivo, o DietIA terá:
- ✅ **Autenticação** com Supabase
- ✅ **Salvamento de dados** no banco
- ✅ **Gerenciamento de usuários**
- ✅ **Segurança** com RLS

**Crie o arquivo `.env.local` na pasta `diet-quiz-app/` com o conteúdo acima!**
