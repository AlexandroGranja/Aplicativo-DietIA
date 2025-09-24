-- Script para corrigir o usuário existente
-- Execute este script no SQL Editor do Supabase

-- Inserir o perfil do usuário existente
INSERT INTO public.profiles (id, full_name, username, email)
VALUES (
  '49157deb-3723-4317-a4d9-217561bf716a',
  'Alexandro Granja',
  'alegranja',
  'alexxx.granja@hotmail.com'
)
ON CONFLICT (id) DO UPDATE SET
  full_name = EXCLUDED.full_name,
  username = EXCLUDED.username,
  email = EXCLUDED.email;

-- Verificar se foi inserido corretamente
SELECT * FROM public.profiles WHERE id = '49157deb-3723-4317-a4d9-217561bf716a';
