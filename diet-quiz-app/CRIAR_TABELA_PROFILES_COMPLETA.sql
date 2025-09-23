-- Script para criar a tabela profiles do zero
-- Execute este script no SQL Editor do Supabase

-- Criar a tabela profiles
CREATE TABLE public.profiles (
  id uuid NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  full_name text NULL,
  username text UNIQUE NULL,
  email text NULL,
  avatar_url text NULL,
  created_at timestamp with time zone NULL DEFAULT now(),
  updated_at timestamp with time zone NULL DEFAULT now(),
  CONSTRAINT profiles_pkey PRIMARY KEY (id)
) TABLESPACE pg_default;

-- Criar trigger para atualizar 'updated_at' automaticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Aplicar trigger na tabela profiles
CREATE TRIGGER update_profiles_updated_at 
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();

-- Habilitar Row Level Security (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Políticas de RLS para a tabela profiles
CREATE POLICY "Public profiles are viewable by everyone." 
  ON public.profiles
  FOR SELECT USING (true);

CREATE POLICY "Users can insert their own profile." 
  ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile." 
  ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can delete own profile." 
  ON public.profiles
  FOR DELETE USING (auth.uid() = id);

-- Criar índice para melhor performance na busca por username
CREATE INDEX idx_profiles_username ON public.profiles(username);

-- Comentário: Tabela profiles criada com sucesso!
-- Agora os usuários podem fazer login usando username em vez de email
