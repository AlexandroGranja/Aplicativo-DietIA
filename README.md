## DietIA – Instalação e Execução

Projeto com formulário (frontend React/Vite), API (Flask/SQLite) e integração com n8n/Evolution API para envio de dietas via WhatsApp.

### Requisitos

- Node.js 18+ e npm 9+
- Python 3.10+
- Docker (opcional, para rodar n8n rapidamente)
- Linux/macOS/WSL (passos testados em Linux)

### Estrutura

- `ubuntu/diet-quiz-app`: Frontend (React + Vite + Tailwind)
- `ubuntu/diet-api`: Backend (Flask + SQLAlchemy + SQLite)
- `ubuntu/n8n_configuration.md`: Instruções e JSON dos workflows n8n

### 1) Backend (Flask)

1. Criar venv e instalar dependências
```bash
cd ubuntu/diet-api
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```

2. Executar a API (porta 5000)
```bash
python src/main.py
```

- Banco SQLite será criado automaticamente em `ubuntu/diet-api/src/database/app.db`.
- Endpoints úteis:
  - `POST /api/quiz` – recebe quiz e cria/atualiza usuário
  - `POST /api/ai/generate-diet/{user_id}` – gera dieta do dia e salva
  - `POST /api/ai/ingest-diet/{user_id}` – ingere dieta gerada por agente (n8n)
  - `GET /api/user/{user_id}` – detalhes do usuário
  - `GET /api/user/{user_id}/diets` – dietas do usuário
  - `GET /api/notifications/scheduled-users` – usuários agendados (sistema de notificações)

Opcional – e-mail: para enviar dietas por e-mail, ajuste em `src/notification_service.py` a configuração SMTP e descomente `configure_email` dentro de `start_notification_system()`.

### 2) Frontend (Vite)

1. Instalar dependências
```bash
cd ubuntu/diet-quiz-app
npm install
```

2. Rodar em desenvolvimento (porta 5173)
```bash
npm run dev
```

3. Acessar o app
```
http://localhost:5173
```

O botão “Enviar Respostas” fará `POST http://localhost:5000/api/quiz` com os dados mapeados. Calorias diárias são estimadas automaticamente.

Build de produção (opcional):
```bash
npm run build
```

### 3) n8n + Evolution API (WhatsApp)

Você pode usar Docker para subir o n8n rapidamente:
```bash
docker run -it --rm -p 5678:5678 -v ~/.n8n:/home/node/.n8n n8nio/n8n:latest
```
Acesse o n8n: `http://localhost:5678`

Passos:
- Importe os workflows do arquivo `ubuntu/n8n_configuration.md` (seção “Workflows JSON”).
- Configure credenciais da Evolution API/WhatsApp no node apropriado do seu fluxo.
- Fluxo recomendado (WhatsApp):
  1) Webhook recebe mensagem do usuário (Evolution API)
  2) Identifica `user_id`
  3) Gera dieta no agente (LLM ou regra)
  4) `POST http://localhost:5000/api/ai/ingest-diet/{user_id}` com o JSON da dieta
  5) Envia `formatted_diet` de volta ao WhatsApp via Evolution API

Contrato do endpoint de ingestão (exemplo):
```json
{
  "diet_data": {
    "data": "2025-09-22",
    "refeicoes": {
      "cafe_da_manha": { "nome": "Café da Manhã", "alimentos": [], "calorias_total": 400 },
      "almoco": { "nome": "Almoço", "alimentos": [], "calorias_total": 800 },
      "jantar": { "nome": "Jantar", "alimentos": [], "calorias_total": 600 }
    },
    "resumo_nutricional": { "calorias_total": 1800, "proteina_total": 120, "carbs_total": 180, "gordura_total": 60 }
  },
  "ai_prompt_used": "agente_n8n_v1"
}
```
Resposta inclui `formatted_diet` pronto para enviar ao WhatsApp.

### 4) Dicas e Solução de Problemas

- Porta em uso (5000/5173/5678): pare serviços antigos ou altere portas.
- CORS: os endpoints usam `flask-cors` com `@cross_origin()`.
- Reset do banco: apague `ubuntu/diet-api/src/database/app.db` com a API parada.
- Logs do n8n: use a UI para depurar erros de workflow.

### 5) Comandos Rápidos

Backend:
```bash
cd ubuntu/diet-api && python -m venv .venv && source .venv/bin/activate && pip install -r requirements.txt && python src/main.py
```

Frontend:
```bash
cd ubuntu/diet-quiz-app && npm install && npm run dev
```

n8n (Docker):
```bash
docker run -it --rm -p 5678:5678 -v ~/.n8n:/home/node/.n8n n8nio/n8n:latest
```

---

Pronto! Com backend (5000), frontend (5173) e n8n (5678) rodando, você consegue captar os dados, gerar/ingerir dietas e enviar pelo WhatsApp via Evolution API.

