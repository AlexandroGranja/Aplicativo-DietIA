# Como Atualizar a Tabela para Suportar Username

## Passos para Adicionar Campo Username:

### 1. Acesse o Supabase Dashboard
- Vá para: https://supabase.com/dashboard
- Faça login na sua conta
- Selecione o projeto `ftqnkqmguwncowpwmlvm`

### 2. Execute o Script SQL
- No menu lateral esquerdo, clique em **"SQL Editor"**
- Clique em **"New query"**
- Copie e cole o conteúdo do arquivo `ATUALIZAR_TABELA_USERNAME.sql`
- Clique em **"Run"** para executar

### 3. Verifique se Funcionou
- Vá em **"Table Editor"**
- Selecione a tabela **"profiles"**
- Verifique se a coluna **"username"** foi adicionada

## O que o Script Faz:
- ✅ Adiciona coluna `username` na tabela `profiles` (UNIQUE)
- ✅ Adiciona coluna `email` na tabela `profiles`
- ✅ Cria índice para melhor performance
- ✅ Atualiza políticas de segurança (RLS)
- ✅ Cria função para buscar email por ID

## Após Executar:
1. **Reinicie o frontend** (Ctrl + C e `npm run dev`)
2. **Teste o cadastro** com nome de usuário
3. **Teste o login** usando o nome de usuário

**Execute o script e me diga se funcionou!** 🚀
