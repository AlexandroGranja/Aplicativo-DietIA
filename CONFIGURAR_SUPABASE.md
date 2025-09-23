# 🔥 Configurar Supabase - DietIA

## ✅ Suas Credenciais

**URL do Projeto**: `https://ftqnkqmguwncowpwmlvm.supabase.co`
**Chave Anônima**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ0cW5rcW1ndXduY293cHdtbHZtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg1ODU1MzIsImV4cCI6MjA3NDE2MTUzMn0.AxcjHo3_m3tpueyUvlaKdRPuvi8-DXZvRMydZ1GyVkI`

## 🚀 Passo a Passo

### 1. Criar Arquivo .env.local

Crie o arquivo `.env.local` na pasta `diet-quiz-app/` com o seguinte conteúdo:

```env
VITE_SUPABASE_URL=https://ftqnkqmguwncowpwmlvm.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ0cW5rcW1ndXduY293cHdtbHZtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg1ODU1MzIsImV4cCI6MjA3NDE2MTUzMn0.AxcjHo3_m3tpueyUvlaKdRPuvi8-DXZvRMydZ1GyVkI
VITE_API_URL=http://localhost:5000
```

### 2. Executar Scripts SQL

Acesse o **SQL Editor** no seu Supabase e execute os scripts abaixo:

#### Script 1: Tabela de Perfis
```sql
-- Criar tabela de perfis
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  full_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Habilitar RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Políticas de segurança
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);
```

#### Script 2: Tabela de Respostas do Quiz
```sql
-- Criar tabela de respostas do quiz
CREATE TABLE quiz_responses (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Dados pessoais
  name TEXT,
  age INTEGER,
  gender TEXT CHECK (gender IN ('male', 'female', 'other')),
  height DECIMAL(5,2),
  current_weight DECIMAL(5,2),
  target_weight DECIMAL(5,2),
  
  -- Objetivos
  main_goal TEXT CHECK (main_goal IN ('perder_peso', 'ganhar_massa', 'manter_peso', 'melhorar_saude')),
  
  -- Rotina diária
  wake_up_time TIME,
  sleep_time TIME,
  meals_per_day TEXT CHECK (meals_per_day IN ('3', '4', '5', '6+')),
  
  -- Atividade física
  exercise_regularly TEXT CHECK (exercise_regularly IN ('yes', 'no', 'sometimes')),
  exercise_type JSONB DEFAULT '[]'::jsonb,
  
  -- Preferências alimentares
  vegetarian BOOLEAN DEFAULT FALSE,
  vegan BOOLEAN DEFAULT FALSE,
  favorite_foods TEXT,
  cooking_skill TEXT CHECK (cooking_skill IN ('beginner', 'intermediate', 'advanced')),
  
  -- Restrições
  allergies TEXT,
  intolerances TEXT,
  disliked_foods TEXT,
  
  -- Alimentação atual
  current_breakfast TEXT,
  current_lunch TEXT,
  current_dinner TEXT,
  water_intake DECIMAL(3,1),
  
  -- Metadados
  language TEXT DEFAULT 'pt',
  daily_calories INTEGER,
  bmi DECIMAL(4,2),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Habilitar RLS
ALTER TABLE quiz_responses ENABLE ROW LEVEL SECURITY;

-- Políticas de segurança
CREATE POLICY "Users can view own quiz responses" ON quiz_responses
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own quiz responses" ON quiz_responses
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own quiz responses" ON quiz_responses
  FOR UPDATE USING (auth.uid() = user_id);
```

#### Script 3: Funções e Triggers
```sql
-- Função para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Aplicar triggers
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_quiz_responses_updated_at BEFORE UPDATE ON quiz_responses
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Função para criar perfil automaticamente
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, avatar_url)
  VALUES (NEW.id, NEW.raw_user_meta_data->>'name', NEW.raw_user_meta_data->>'avatar_url');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger para criar perfil automaticamente
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
```

### 3. Configurar Autenticação

1. No dashboard do Supabase, vá em **Authentication** > **Settings**
2. Em **Site URL**, adicione: `http://localhost:5173`
3. Em **Redirect URLs**, adicione: `http://localhost:5173`
4. Salve as configurações

### 4. Testar a Configuração

1. **Reinicie o frontend**:
```bash
cd diet-quiz-app
npm run dev
```

2. **Acesse**: `http://localhost:5173`

3. **Teste o cadastro**: Crie uma conta de teste
4. **Teste o login**: Faça login com a conta criada
5. **Teste o quiz**: Preencha o formulário e envie

### 5. Verificar Dados

1. No dashboard do Supabase, vá em **Table Editor**
2. Clique em **profiles** para ver usuários cadastrados
3. Clique em **quiz_responses** para ver respostas do quiz

## ✅ Pronto!

Agora seu DietIA tem:
- ✅ **Sistema de login/cadastro**
- ✅ **Salvamento de dados** no banco
- ✅ **Gerenciamento de usuários**
- ✅ **Segurança** com RLS

**Teste agora em**: `http://localhost:5173`
