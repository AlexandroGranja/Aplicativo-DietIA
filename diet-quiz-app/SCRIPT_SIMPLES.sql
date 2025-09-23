-- Script MUITO SIMPLES - Execute apenas estas linhas no Supabase

-- Adicionar coluna username
ALTER TABLE public.profiles ADD COLUMN username text;

-- Adicionar coluna email  
ALTER TABLE public.profiles ADD COLUMN email text;

-- Tornar username único
ALTER TABLE public.profiles ADD CONSTRAINT profiles_username_unique UNIQUE (username);
