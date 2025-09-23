# 🔥 Como Criar as Tabelas no Supabase - DietIA

## 📋 **Passo a Passo Completo**

### 1. **Acesse o Supabase Dashboard**
- Vá para: https://supabase.com/dashboard
- Entre no seu projeto: `ftqnkqmguwncowpwmlvm`

### 2. **Vá para o SQL Editor**
- No menu lateral, clique em **"SQL Editor"**
- Clique em **"New query"**

### 3. **Execute o Script Completo**
- Copie todo o conteúdo do arquivo `TABELAS_SUPABASE_COMPLETAS.sql`
- Cole no editor SQL
- Clique em **"Run"** (ou pressione Ctrl+Enter)

### 4. **Verifique se Funcionou**
- Você deve ver uma mensagem de sucesso
- As tabelas `profiles`, `quiz_responses` e `user_data` devem aparecer na aba **"Table Editor"**

## 🗂️ **Tabelas que Serão Criadas**

### **1. profiles** (você já tem)
- Armazena dados básicos do usuário
- Vinculada ao `auth.users`

### **2. quiz_responses** 
- Armazena as respostas do quiz em formato JSON
- Permite múltiplas respostas por usuário

### **3. user_data**
- Armazena dados estruturados do quiz
- Facilita consultas e relatórios

## 🔒 **Segurança Configurada**

- ✅ **RLS (Row Level Security)** habilitado
- ✅ **Políticas de segurança** criadas
- ✅ **Usuários só veem seus próprios dados**
- ✅ **Triggers para atualizar timestamps**

## 🧪 **Teste Após Criar**

1. **Acesse o app**: `http://localhost:5173`
2. **Crie uma conta** nova
3. **Preencha o quiz** completo
4. **Verifique no Supabase** se os dados foram salvos

## 🆘 **Se Der Erro**

### **Erro de Permissão**
```sql
-- Execute este comando primeiro:
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;
```

### **Erro de Função**
```sql
-- Se der erro na função, execute:
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';
```

## ✅ **Verificação Final**

Após executar o script, você deve ver:
- ✅ 3 tabelas criadas
- ✅ Políticas de segurança ativas
- ✅ Triggers funcionando
- ✅ Índices criados

**Agora o DietIA vai conseguir salvar e recuperar os dados dos usuários!** 🎉
