# 🔥 Configuração Correta do Supabase - DietIA

## ⚠️ **PROBLEMA IDENTIFICADO**
Você está usando a chave de **SERVIÇO** em vez da chave **ANÔNIMA**!

## 🔑 **Chaves Corretas**

### 1. **Chave Anônima (para o frontend):**
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ0cW5rcW1ndXduY293cHdtbHZtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg1ODU1MzIsImV4cCI6MjA3NDE2MTUzMn0.AxcjHo3_m3tpueyUvlaKdRPuvi8-DXZvRMydZ1GyVkI
```

### 2. **Chave de Serviço (para o backend):**
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ0cW5rcW1ndXduY293cHdtbHZtIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1ODU4NTUzMiwiZXhwIjoyMDc0MTYxNTMyfQ.AxcjHo3_m3tpueyUvlaKdRPuvi8-DXZvRMydZ1GyVkI
```

## 🛠️ **Passos para Corrigir**

### 1. **Acesse o Supabase Dashboard**
- Vá para: https://supabase.com/dashboard
- Entre no seu projeto: `ftqnkqmguwncowpwmlvm`

### 2. **Vá em Authentication > Settings**
- Clique em "Authentication" no menu lateral
- Clique em "Settings"
- Copie a **chave anônima** (anon key)

### 3. **Atualize o arquivo .env.local**
Substitua o conteúdo do arquivo `.env.local` por:
```env
VITE_SUPABASE_URL=https://ftqnkqmguwncowpwmlvm.supabase.co
VITE_SUPABASE_ANON_KEY=SUA_CHAVE_ANONIMA_AQUI
VITE_API_URL=http://localhost:5000
```

### 4. **Crie as Tabelas no Supabase**
Vá em **SQL Editor** e execute este código:

```sql
-- Tabela para perfis de usuário
CREATE TABLE IF NOT EXISTS user_profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  name TEXT,
  email TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela para respostas do quiz
CREATE TABLE IF NOT EXISTS quiz_responses (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  quiz_data JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Habilitar RLS (Row Level Security)
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE quiz_responses ENABLE ROW LEVEL SECURITY;

-- Políticas de segurança
CREATE POLICY "Users can view own profile" ON user_profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON user_profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON user_profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can view own quiz responses" ON quiz_responses
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own quiz responses" ON quiz_responses
  FOR INSERT WITH CHECK (auth.uid() = user_id);
```

### 5. **Reinicie o Servidor**
```bash
# Pare o servidor (Ctrl+C)
# Depois execute:
npm run dev
```

## ✅ **Teste**
1. Acesse `http://localhost:5173`
2. Tente criar uma conta
3. Deve funcionar agora!

## 🆘 **Se Ainda Der Erro**
Verifique o console do navegador (F12) para ver a mensagem de erro específica.
