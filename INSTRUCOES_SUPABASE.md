# 🔥 Instruções para Configurar o Supabase

## 📋 Passo a Passo Completo

### 1. Criar Conta no Supabase

1. Acesse [supabase.com](https://supabase.com)
2. Clique em "Start your project"
3. Faça login com GitHub, Google ou email
4. Clique em "New Project"

### 2. Criar Projeto

1. **Nome do projeto**: `dietia-app`
2. **Senha do banco**: Escolha uma senha forte (salve ela!)
3. **Região**: Escolha a mais próxima (ex: South America - São Paulo)
4. Clique em "Create new project"
5. Aguarde alguns minutos para o projeto ser criado

### 3. Obter Credenciais

1. No dashboard, vá em **Settings** (ícone de engrenagem)
2. Clique em **API**
3. Copie as seguintes informações:

```
Project URL: https://xxxxx.supabase.co
anon public key: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### 4. Configurar Variáveis de Ambiente

Crie o arquivo `.env.local` na pasta `ubuntu/diet-quiz-app/`:

```env
VITE_SUPABASE_URL=https://seu-projeto.supabase.co
VITE_SUPABASE_ANON_KEY=sua-chave-anonima-aqui
VITE_API_URL=http://localhost:5000
```

### 5. Executar Scripts SQL

1. No dashboard do Supabase, vá em **SQL Editor**
2. Clique em **New Query**
3. Cole e execute cada script abaixo (um por vez):

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

### 6. Testar a Configuração

1. **Verificar tabelas criadas**:
```sql
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('profiles', 'quiz_responses');
```

2. **Verificar políticas RLS**:
```sql
SELECT schemaname, tablename, policyname 
FROM pg_policies 
WHERE schemaname = 'public';
```

### 7. Configurar Autenticação

1. No dashboard, vá em **Authentication** > **Settings**
2. Em **Site URL**, adicione: `http://localhost:5173`
3. Em **Redirect URLs**, adicione: `http://localhost:5173`
4. Salve as configurações

### 8. Testar o Aplicativo

1. **Iniciar o frontend**:
```bash
cd ubuntu/diet-quiz-app
npm run dev
```

2. **Acessar**: `http://localhost:5173`

3. **Testar cadastro**: Crie uma conta de teste
4. **Testar login**: Faça login com a conta criada
5. **Testar quiz**: Preencha o formulário e envie

### 9. Verificar Dados no Supabase

1. No dashboard, vá em **Table Editor**
2. Clique em **profiles** para ver usuários cadastrados
3. Clique em **quiz_responses** para ver respostas do quiz

## 🔧 Comandos Úteis

### Resetar Banco (CUIDADO!)
```sql
-- APAGA TODOS OS DADOS - USE COM CUIDADO!
DROP TABLE IF EXISTS quiz_responses CASCADE;
DROP TABLE IF EXISTS profiles CASCADE;
```

### Backup do Banco
```bash
# Usando pg_dump
pg_dump "postgresql://postgres:[PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres" > backup.sql
```

## 🚨 Troubleshooting

### Erro de CORS
- Verifique se as URLs estão configuradas corretamente em Authentication > Settings

### Erro de RLS
- Verifique se as políticas foram criadas corretamente
- Teste desabilitando RLS temporariamente para debug

### Erro de Conexão
- Verifique se as credenciais estão corretas no `.env.local`
- Verifique se o projeto está ativo no Supabase

### Erro de Permissão
- Verifique se o usuário tem permissão para acessar as tabelas
- Verifique se as políticas RLS estão corretas

## 📊 Monitoramento

### Dashboard do Supabase
- **Database** > **Tables**: Ver tabelas e dados
- **Authentication** > **Users**: Ver usuários cadastrados
- **Logs**: Ver atividade e erros

### Queries Úteis
```sql
-- Contar usuários
SELECT COUNT(*) FROM auth.users;

-- Contar respostas de quiz
SELECT COUNT(*) FROM quiz_responses;

-- Ver últimas respostas
SELECT name, main_goal, created_at 
FROM quiz_responses 
ORDER BY created_at DESC 
LIMIT 10;
```

## ✅ Checklist de Configuração

- [ ] Conta criada no Supabase
- [ ] Projeto criado
- [ ] Credenciais obtidas
- [ ] Arquivo `.env.local` configurado
- [ ] Tabelas criadas
- [ ] Políticas RLS configuradas
- [ ] Triggers criados
- [ ] Autenticação configurada
- [ ] Aplicativo testado
- [ ] Dados sendo salvos

---

🎉 **Configuração do Supabase concluída!** Agora você pode usar o sistema de autenticação e banco de dados no DietIA.
