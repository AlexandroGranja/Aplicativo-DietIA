-- ========================================
-- TABELAS COMPLETAS PARA O DIETIA
-- ========================================

-- 1. Tabela de perfis (você já criou)
-- CREATE TABLE public.profiles (
--   id uuid not null,
--   full_name text null,
--   avatar_url text null,
--   created_at timestamp with time zone null default now(),
--   updated_at timestamp with time zone null default now(),
--   constraint profiles_pkey primary key (id),
--   constraint profiles_id_fkey foreign KEY (id) references auth.users (id) on delete CASCADE
-- ) TABLESPACE pg_default;

-- 2. Tabela para respostas do quiz
CREATE TABLE IF NOT EXISTS public.quiz_responses (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  quiz_data jsonb NOT NULL,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- 3. Tabela para dados do usuário (informações do quiz)
CREATE TABLE IF NOT EXISTS public.user_data (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name text,
  age integer,
  gender text,
  height decimal,
  current_weight decimal,
  target_weight decimal,
  main_goal text,
  wake_up_time time,
  sleep_time time,
  meals_per_day text,
  exercise_regularly text,
  exercise_type jsonb,
  vegetarian boolean,
  vegan boolean,
  favorite_foods text,
  cooking_skill text,
  allergies text,
  intolerances text,
  disliked_foods text,
  current_breakfast text,
  current_lunch text,
  current_dinner text,
  water_intake decimal,
  daily_calories integer,
  language text DEFAULT 'pt',
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- ========================================
-- HABILITAR RLS (Row Level Security)
-- ========================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quiz_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_data ENABLE ROW LEVEL SECURITY;

-- ========================================
-- POLÍTICAS DE SEGURANÇA
-- ========================================

-- Políticas para profiles
CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Políticas para quiz_responses
CREATE POLICY "Users can view own quiz responses" ON public.quiz_responses
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own quiz responses" ON public.quiz_responses
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own quiz responses" ON public.quiz_responses
  FOR UPDATE USING (auth.uid() = user_id);

-- Políticas para user_data
CREATE POLICY "Users can view own user data" ON public.user_data
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own user data" ON public.user_data
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own user data" ON public.user_data
  FOR UPDATE USING (auth.uid() = user_id);

-- ========================================
-- FUNÇÃO PARA ATUALIZAR updated_at
-- ========================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- ========================================
-- TRIGGERS PARA updated_at
-- ========================================

-- Trigger para profiles (você já criou)
-- CREATE TRIGGER update_profiles_updated_at BEFORE
-- UPDATE ON profiles FOR EACH ROW
-- EXECUTE FUNCTION update_updated_at_column();

-- Triggers para as novas tabelas
CREATE TRIGGER update_quiz_responses_updated_at BEFORE
UPDATE ON public.quiz_responses FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_data_updated_at BEFORE
UPDATE ON public.user_data FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- ========================================
-- ÍNDICES PARA PERFORMANCE
-- ========================================

CREATE INDEX IF NOT EXISTS idx_quiz_responses_user_id ON public.quiz_responses(user_id);
CREATE INDEX IF NOT EXISTS idx_quiz_responses_created_at ON public.quiz_responses(created_at);
CREATE INDEX IF NOT EXISTS idx_user_data_user_id ON public.user_data(user_id);
CREATE INDEX IF NOT EXISTS idx_user_data_created_at ON public.user_data(created_at);

-- ========================================
-- COMENTÁRIOS DAS TABELAS
-- ========================================

COMMENT ON TABLE public.profiles IS 'Perfis dos usuários do DietIA';
COMMENT ON TABLE public.quiz_responses IS 'Respostas do quiz de nutrição';
COMMENT ON TABLE public.user_data IS 'Dados detalhados dos usuários do quiz';

-- ========================================
-- VERIFICAÇÃO FINAL
-- ========================================

-- Verificar se as tabelas foram criadas
SELECT table_name, table_type 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('profiles', 'quiz_responses', 'user_data')
ORDER BY table_name;
