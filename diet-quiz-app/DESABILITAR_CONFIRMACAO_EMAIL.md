# Como Desabilitar a Confirmação de Email no Supabase

Para resolver o problema "Email not confirmed", você precisa desabilitar a confirmação de email no Supabase:

## Passos:

1. **Acesse o Dashboard do Supabase:**
   - Vá para [https://supabase.com/dashboard](https://supabase.com/dashboard)
   - Selecione seu projeto `ftqnkqmguwncowpwmlvm`

2. **Navegue até Authentication:**
   - No menu lateral esquerdo, clique em **"Authentication"**
   - Clique na aba **"Settings"** (Configurações)

3. **Desabilite a Confirmação de Email:**
   - Procure por **"Email confirmation"** ou **"Confirmar email"**
   - **DESMARQUE** a opção **"Enable email confirmations"** ou **"Habilitar confirmação de email"**
   - Clique em **"Save"** ou **"Salvar"**

4. **Reinicie o Frontend:**
   - Pare o servidor (Ctrl + C)
   - Execute `npm run dev` novamente

## Alternativa (se não encontrar a opção):

Se não conseguir encontrar a opção, você pode:

1. **Ir para Authentication > Users**
2. **Clicar no usuário que você criou**
3. **Clicar em "Confirm email"** para confirmar manualmente

Após fazer isso, o login deve funcionar normalmente!
