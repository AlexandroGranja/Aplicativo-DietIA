# Configuração do N8N para DietIA

## Workflows Criados

### 1. Workflow de Geração Diária de Dietas

**Trigger:** Cron Schedule (diário)
**Descrição:** Gera dietas para todos os usuários agendados

**Nós:**
1. **Schedule Trigger** - Executa diariamente às 06:00
2. **HTTP Request** - Busca usuários agendados (`GET /api/notifications/scheduled-users`)
3. **Split In Batches** - Processa usuários em lotes
4. **HTTP Request** - Gera dieta para cada usuário (`POST /api/ai/generate-diet/{user_id}`)
5. **HTTP Request** - Envia notificação por email (`POST /api/notifications/send-test-email/{user_id}`)

### 2. Workflow de Notificação Imediata

**Trigger:** Webhook
**Descrição:** Envia notificação imediata quando solicitado

**Nós:**
1. **Webhook** - Recebe dados do usuário
2. **HTTP Request** - Gera dieta (`POST /api/ai/generate-diet/{user_id}`)
3. **Condition** - Verifica se geração foi bem-sucedida
4. **HTTP Request** - Envia email (`POST /api/notifications/send-test-email/{user_id}`)
5. **HTTP Request** - Envia push notification (`POST /api/notifications/send-push/{user_id}`)

### 3. Workflow de Backup de Dados

**Trigger:** Cron Schedule (semanal)
**Descrição:** Faz backup dos dados dos usuários

**Nós:**
1. **Schedule Trigger** - Executa semanalmente
2. **HTTP Request** - Busca todos os usuários (`GET /api/users`)
3. **Write Binary File** - Salva backup em JSON

## Configuração Manual do N8N

Como o N8N está rodando localmente, você pode acessar em:
http://localhost:5678

### Passos para configurar:

1. **Acesse o N8N** em http://localhost:5678
2. **Crie uma conta** (primeira vez)
3. **Importe os workflows** usando os JSONs abaixo
4. **Configure as credenciais** da API local
5. **Ative os workflows**

### Credenciais necessárias:

- **API Local**: http://localhost:5000
- **Email SMTP**: Configure com suas credenciais de email

## Workflows JSON

### Workflow 1: Geração Diária
```json
{
  "name": "DietIA - Geração Diária de Dietas",
  "nodes": [
    {
      "parameters": {
        "rule": {
          "interval": [
            {
              "field": "cronExpression",
              "expression": "0 6 * * *"
            }
          ]
        }
      },
      "name": "Schedule Trigger",
      "type": "n8n-nodes-base.scheduleTrigger",
      "typeVersion": 1,
      "position": [240, 300]
    },
    {
      "parameters": {
        "url": "http://localhost:5000/api/notifications/scheduled-users",
        "options": {}
      },
      "name": "Buscar Usuários Agendados",
      "type": "n8n-nodes-base.httpRequest",
      "typeVersion": 1,
      "position": [460, 300]
    },
    {
      "parameters": {
        "batchSize": 5,
        "options": {}
      },
      "name": "Split In Batches",
      "type": "n8n-nodes-base.splitInBatches",
      "typeVersion": 1,
      "position": [680, 300]
    },
    {
      "parameters": {
        "url": "=http://localhost:5000/api/ai/generate-diet/{{$json[\"user_id\"]}}",
        "requestMethod": "POST",
        "options": {}
      },
      "name": "Gerar Dieta",
      "type": "n8n-nodes-base.httpRequest",
      "typeVersion": 1,
      "position": [900, 300]
    },
    {
      "parameters": {
        "url": "=http://localhost:5000/api/notifications/send-test-email/{{$json[\"user_id\"]}}",
        "requestMethod": "POST",
        "jsonParameters": true,
        "options": {},
        "bodyParametersJson": "={\"email\": \"{{$json[\"email\"]}}\"}"
      },
      "name": "Enviar Email",
      "type": "n8n-nodes-base.httpRequest",
      "typeVersion": 1,
      "position": [1120, 300]
    }
  ],
  "connections": {
    "Schedule Trigger": {
      "main": [
        [
          {
            "node": "Buscar Usuários Agendados",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Buscar Usuários Agendados": {
      "main": [
        [
          {
            "node": "Split In Batches",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Split In Batches": {
      "main": [
        [
          {
            "node": "Gerar Dieta",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Gerar Dieta": {
      "main": [
        [
          {
            "node": "Enviar Email",
            "type": "main",
            "index": 0
          }
        ]
      ]
    }
  }
}
```

### Workflow 2: Notificação Imediata
```json
{
  "name": "DietIA - Notificação Imediata",
  "nodes": [
    {
      "parameters": {
        "path": "diet-notification",
        "options": {}
      },
      "name": "Webhook",
      "type": "n8n-nodes-base.webhook",
      "typeVersion": 1,
      "position": [240, 300],
      "webhookId": "diet-notification"
    },
    {
      "parameters": {
        "url": "=http://localhost:5000/api/ai/generate-diet/{{$json[\"body\"][\"user_id\"]}}",
        "requestMethod": "POST",
        "options": {}
      },
      "name": "Gerar Dieta",
      "type": "n8n-nodes-base.httpRequest",
      "typeVersion": 1,
      "position": [460, 300]
    },
    {
      "parameters": {
        "conditions": {
          "string": [
            {
              "value1": "={{$json[\"success\"]}}",
              "operation": "equal",
              "value2": "true"
            }
          ]
        }
      },
      "name": "IF Success",
      "type": "n8n-nodes-base.if",
      "typeVersion": 1,
      "position": [680, 300]
    },
    {
      "parameters": {
        "url": "=http://localhost:5000/api/notifications/send-test-email/{{$json[\"user_id\"]}}",
        "requestMethod": "POST",
        "jsonParameters": true,
        "options": {},
        "bodyParametersJson": "={\"email\": \"{{$json[\"body\"][\"email\"]}}\"}"
      },
      "name": "Enviar Email",
      "type": "n8n-nodes-base.httpRequest",
      "typeVersion": 1,
      "position": [900, 200]
    },
    {
      "parameters": {
        "url": "=http://localhost:5000/api/notifications/send-push/{{$json[\"user_id\"]}}",
        "requestMethod": "POST",
        "jsonParameters": true,
        "options": {},
        "bodyParametersJson": "={\"title\": \"Nova Dieta Disponível!\", \"body\": \"Sua dieta personalizada está pronta!\"}"
      },
      "name": "Enviar Push",
      "type": "n8n-nodes-base.httpRequest",
      "typeVersion": 1,
      "position": [900, 400]
    }
  ],
  "connections": {
    "Webhook": {
      "main": [
        [
          {
            "node": "Gerar Dieta",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Gerar Dieta": {
      "main": [
        [
          {
            "node": "IF Success",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "IF Success": {
      "main": [
        [
          {
            "node": "Enviar Email",
            "type": "main",
            "index": 0
          },
          {
            "node": "Enviar Push",
            "type": "main",
            "index": 0
          }
        ]
      ]
    }
  }
}
```

## Instruções de Uso

1. **Copie os JSONs** dos workflows acima
2. **No N8N**, clique em "Import from JSON"
3. **Cole o JSON** e importe
4. **Configure as URLs** se necessário
5. **Ative o workflow**

## Monitoramento

O N8N fornece logs detalhados de execução, permitindo monitorar:
- Sucessos e falhas
- Tempo de execução
- Dados processados
- Erros e debugging

