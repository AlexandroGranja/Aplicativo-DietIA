-- Script SIMPLIFICADO para adicionar campo username na tabela profiles
-- Execute este script no SQL Editor do Supabase

-- Adicionar colunas username e email na tabela profiles
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS username text UNIQUE,
ADD COLUMN IF NOT EXISTS email text;

-- Criar índice para melhor performance na busca por username
CREATE INDEX IF NOT EXISTS idx_profiles_username ON public.profiles(username);

-- Atualizar política RLS para permitir busca por username
CREATE POLICY IF NOT EXISTS "Users can search by username" ON public.profiles
  FOR SELECT USING (true);

-- Comentário: Agora os usuários podem fazer login usando username em vez de email
-- O email será salvo na tabela profiles para facilitar o login
