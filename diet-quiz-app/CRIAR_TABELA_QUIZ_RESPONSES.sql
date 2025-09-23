-- Script para criar a tabela quiz_responses
-- Execute este script no SQL Editor do Supabase

-- Criar a tabela quiz_responses
CREATE TABLE public.quiz_responses (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  user_id uuid NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  full_name text NULL,
  age int2 NULL,
  gender text NULL,
  height float4 NULL,
  current_weight float4 NULL,
  target_weight float4 NULL,
  main_goal text NULL,
  wake_up_time text NULL,
  sleep_time text NULL,
  meals_per_day text NULL,
  exercise_regularly text NULL,
  exercise_type jsonb NULL,
  vegetarian bool NULL,
  vegan bool NULL,
  favorite_foods text NULL,
  cooking_skill text NULL,
  allergies text NULL,
  intolerances text NULL,
  disliked_foods text NULL,
  current_breakfast text NULL,
  current_lunch text NULL,
  current_dinner text NULL,
  water_intake float4 NULL,
  language text NULL,
  daily_calories int4 NULL,
  created_at timestamp with time zone NULL DEFAULT now(),
  updated_at timestamp with time zone NULL DEFAULT now(),
  CONSTRAINT quiz_responses_pkey PRIMARY KEY (id)
) TABLESPACE pg_default;

-- Aplicar trigger na tabela quiz_responses
CREATE TRIGGER update_quiz_responses_updated_at 
  BEFORE UPDATE ON public.quiz_responses
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();

-- Habilitar Row Level Security (RLS)
ALTER TABLE public.quiz_responses ENABLE ROW LEVEL SECURITY;

-- Políticas de RLS para a tabela quiz_responses
CREATE POLICY "Users can insert their own quiz responses." 
  ON public.quiz_responses
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own quiz responses." 
  ON public.quiz_responses
  FOR SELECT USING (auth.uid() = user_id);

-- Comentário: Tabela quiz_responses criada com sucesso!
