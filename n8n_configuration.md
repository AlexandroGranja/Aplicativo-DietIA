# Configuração do n8n para DietIA

## Visão Geral

O DietIA pode ser integrado com n8n de duas formas:
1. **Webhook direto** - Recebe dados do formulário
2. **Supabase** - Integração com banco de dados (recomendado)

## Webhook de Entrada

### URL do Webhook
```
https://your-n8n-instance.com/webhook/diet-quiz
```

### Estrutura dos Dados Recebidos

```json
{
  "name": "João Silva",
  "age": 30,
  "gender": "male",
  "height": 175,
  "currentWeight": 80,
  "targetWeight": 75,
  "mainGoal": "perder_peso",
  "wakeUpTime": "07:00",
  "sleepTime": "23:00",
  "mealsPerDay": "4",
  "exerciseRegularly": "yes",
  "exerciseType": ["weightTraining", "cardio"],
  "vegetarian": "no",
  "vegan": "no",
  "favoriteFoods": "frango, brócolos, aveia",
  "cookingSkill": "intermediate",
  "allergies": "",
  "intolerances": "lactose",
  "dislikedFoods": "peixe",
  "currentBreakfast": "café com leite e pão",
  "currentLunch": "arroz, feijão e frango",
  "currentDinner": "salada e sopa",
  "waterIntake": 2.5,
  "language": "pt",
  "dailyCalories": 2000,
  "timestamp": "2024-01-15T10:30:00.000Z",
  "source": "diet-quiz-app",
  "version": "1.0.0"
}
```

## Workflow Sugerido

### 1. Webhook Trigger
- Recebe os dados do formulário
- Valida a estrutura dos dados

### 2. Processamento de Dados
- Calcula IMC
- Determina categoria de peso
- Ajusta calorias baseado no objetivo

### 3. Geração de Dieta
- Chama API de IA (OpenAI, Claude, etc.)
- Gera plano alimentar personalizado
- Cria lista de compras

### 4. Notificações
- Envia email com a dieta
- Envia notificação por WhatsApp/SMS
- Salva no banco de dados

### 5. Acompanhamento
- Agenda lembretes
- Cria tarefas de follow-up

## Exemplo de Workflow n8n

```json
{
  "nodes": [
    {
      "name": "Webhook",
      "type": "n8n-nodes-base.webhook",
      "parameters": {
        "path": "diet-quiz",
        "httpMethod": "POST"
      }
    },
    {
      "name": "Process Data",
      "type": "n8n-nodes-base.function",
      "parameters": {
        "functionCode": "// Processar dados do formulário\nconst data = $input.first().json;\n\n// Calcular IMC\nconst bmi = data.currentWeight / Math.pow(data.height / 100, 2);\n\n// Determinar categoria\nlet category = 'normal';\nif (bmi < 18.5) category = 'underweight';\nelse if (bmi > 25) category = 'overweight';\nelse if (bmi > 30) category = 'obese';\n\nreturn {\n  ...data,\n  bmi: Math.round(bmi * 10) / 10,\n  category: category\n};"
      }
    },
    {
      "name": "Generate Diet",
      "type": "n8n-nodes-base.openAi",
      "parameters": {
        "resource": "chat",
        "model": "gpt-4",
        "messages": {
          "values": [
            {
              "role": "system",
              "content": "Você é um nutricionista especializado em criar dietas personalizadas."
            },
            {
              "role": "user",
              "content": "Crie uma dieta personalizada baseada nos seguintes dados: {{ $json }}"
            }
          ]
        }
      }
    },
    {
      "name": "Send Email",
      "type": "n8n-nodes-base.emailSend",
      "parameters": {
        "toEmail": "{{ $json.email }}",
        "subject": "Sua Dieta Personalizada - DietIA",
        "message": "{{ $json.diet }}"
      }
    }
  ],
  "connections": {
    "Webhook": {
      "main": [["Process Data"]]
    },
    "Process Data": {
      "main": [["Generate Diet"]]
    },
    "Generate Diet": {
      "main": [["Send Email"]]
    }
  }
}
```

## Variáveis de Ambiente

```env
N8N_WEBHOOK_URL=https://your-n8n-instance.com
OPENAI_API_KEY=your_openai_api_key
EMAIL_SMTP_HOST=smtp.gmail.com
EMAIL_SMTP_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
```

## Monitoramento

- Use o n8n para monitorar execuções
- Configure alertas para falhas
- Monitore performance dos workflows