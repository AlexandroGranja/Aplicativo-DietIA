-- Verificar se o usuário tem perfil na tabela profiles
SELECT * FROM public.profiles WHERE id = '49157deb-3723-4317-a4d9-217561bf716a';

-- Se não existir, criar o perfil
INSERT INTO public.profiles (id, full_name, username, email)
VALUES (
  '49157deb-3723-4317-a4d9-217561bf716a',
  'Alexandro Granja',
  'alegranja',
  'alexxx.granja@hotmail.com'
);
