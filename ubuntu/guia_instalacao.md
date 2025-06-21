# Guia de Instalação e Deploy - DietIA

**Sistema de Dieta com IA - Guia Técnico de Implementação**  
*Versão 1.0*  
*Para Desenvolvedores e Administradores de Sistema*

---

## Visão Geral

Este guia fornece instruções completas para instalação, configuração e deploy do sistema DietIA em diferentes ambientes. O sistema é composto por múltiplos componentes que trabalham em conjunto para fornecer uma experiência completa de geração de dietas personalizadas.

### Componentes do Sistema

1. **Frontend React** - Interface web responsiva
2. **Backend Flask** - API REST e lógica de negócio
3. **Banco de Dados SQLite** - Armazenamento de dados
4. **N8N** - Automação de workflows
5. **Sistema de IA** - Geração de dietas personalizadas

## Pré-requisitos

### Requisitos de Sistema

- **Sistema Operacional**: Linux (Ubuntu 20.04+), macOS, ou Windows 10+
- **Memória RAM**: Mínimo 4GB, recomendado 8GB+
- **Espaço em Disco**: Mínimo 2GB livres
- **Conexão com Internet**: Necessária para instalação de dependências

### Software Necessário

- **Node.js**: Versão 18.0 ou superior
- **Python**: Versão 3.8 ou superior
- **Git**: Para clonagem do repositório
- **npm/yarn**: Gerenciador de pacotes Node.js

### Verificação de Pré-requisitos

```bash
# Verificar versões instaladas
node --version    # Deve ser v18.0+
python3 --version # Deve ser 3.8+
git --version     # Qualquer versão recente
npm --version     # Qualquer versão recente
```

## Instalação Local (Desenvolvimento)

### Passo 1: Preparação do Ambiente

```bash
# Criar diretório do projeto
mkdir dietia-system
cd dietia-system

# Clonar ou criar estrutura de arquivos
# (Assumindo que você tem os arquivos do projeto)
```

### Passo 2: Configuração do Frontend

```bash
# Criar aplicação React
npx create-react-app diet-quiz-app
cd diet-quiz-app

# Instalar dependências adicionais
npm install @radix-ui/react-select @radix-ui/react-checkbox
npm install @radix-ui/react-radio-group @radix-ui/react-progress
npm install lucide-react

# Copiar arquivos do projeto
# - src/App.jsx
# - src/translations.js
# - Outros componentes necessários

# Iniciar servidor de desenvolvimento
npm run dev
```

### Passo 3: Configuração do Backend

```bash
# Voltar ao diretório raiz
cd ..

# Criar aplicação Flask
mkdir diet-api
cd diet-api

# Criar ambiente virtual Python
python3 -m venv venv
source venv/bin/activate  # Linux/Mac
# ou
venv\Scripts\activate     # Windows

# Instalar dependências
pip install flask flask-sqlalchemy flask-cors
pip install requests schedule

# Criar estrutura de diretórios
mkdir -p src/models src/routes

# Copiar arquivos do projeto
# - src/main.py
# - src/models/user.py
# - src/routes/user.py
# - src/routes/ai.py
# - src/routes/notification.py
# - src/ai_diet_generator.py
# - src/notification_service.py

# Inicializar banco de dados
python src/main.py
```

### Passo 4: Configuração do N8N

```bash
# Instalar N8N globalmente
npm install -g n8n

# Criar diretório de dados
mkdir n8n-data
cd n8n-data

# Iniciar N8N
n8n start --tunnel
```

### Passo 5: Verificação da Instalação

```bash
# Verificar se todos os serviços estão rodando
curl http://localhost:5173  # Frontend React
curl http://localhost:5000  # Backend Flask
curl http://localhost:5678  # N8N Interface
```

## Configuração de Produção

### Opção 1: Deploy com Docker

#### Dockerfile para Frontend

```dockerfile
# Dockerfile.frontend
FROM node:18-alpine

WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=0 /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

#### Dockerfile para Backend

```dockerfile
# Dockerfile.backend
FROM python:3.11-slim

WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

EXPOSE 5000
CMD ["python", "src/main.py"]
```

#### Docker Compose

```yaml
# docker-compose.yml
version: '3.8'

services:
  frontend:
    build:
      context: ./diet-quiz-app
      dockerfile: Dockerfile.frontend
    ports:
      - "80:80"
    depends_on:
      - backend

  backend:
    build:
      context: ./diet-api
      dockerfile: Dockerfile.backend
    ports:
      - "5000:5000"
    environment:
      - FLASK_ENV=production
      - DATABASE_URL=sqlite:///dietia.db
    volumes:
      - ./data:/app/data

  n8n:
    image: n8nio/n8n
    ports:
      - "5678:5678"
    environment:
      - N8N_BASIC_AUTH_ACTIVE=true
      - N8N_BASIC_AUTH_USER=admin
      - N8N_BASIC_AUTH_PASSWORD=changeme
    volumes:
      - ./n8n-data:/home/node/.n8n
```

### Opção 2: Deploy Manual em Servidor

#### Configuração do Servidor (Ubuntu)

```bash
# Atualizar sistema
sudo apt update && sudo apt upgrade -y

# Instalar dependências
sudo apt install -y nodejs npm python3 python3-pip nginx

# Instalar PM2 para gerenciamento de processos
sudo npm install -g pm2

# Criar usuário para aplicação
sudo useradd -m -s /bin/bash dietia
sudo su - dietia
```

#### Deploy do Backend

```bash
# Como usuário dietia
cd /home/dietia
git clone <repositorio> dietia-app
cd dietia-app/diet-api

# Configurar ambiente Python
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt

# Configurar PM2
pm2 start src/main.py --name dietia-backend --interpreter python3
pm2 save
pm2 startup
```

#### Deploy do Frontend

```bash
# Compilar aplicação React
cd /home/dietia/dietia-app/diet-quiz-app
npm ci
npm run build

# Configurar Nginx
sudo cp dist/* /var/www/html/
sudo systemctl restart nginx
```

#### Configuração do Nginx

```nginx
# /etc/nginx/sites-available/dietia
server {
    listen 80;
    server_name seu-dominio.com;

    # Frontend
    location / {
        root /var/www/html;
        try_files $uri $uri/ /index.html;
    }

    # Backend API
    location /api {
        proxy_pass http://localhost:5000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
}
```

### Opção 3: Deploy em Plataformas Cloud

#### Vercel (Frontend)

```bash
# Instalar Vercel CLI
npm install -g vercel

# Deploy do frontend
cd diet-quiz-app
vercel --prod
```

#### Heroku (Backend)

```bash
# Instalar Heroku CLI
# Criar Procfile
echo "web: python src/main.py" > Procfile

# Deploy
heroku create dietia-backend
git push heroku main
```

#### Railway (Fullstack)

```bash
# Instalar Railway CLI
npm install -g @railway/cli

# Deploy
railway login
railway init
railway up
```

## Configuração de Banco de Dados

### SQLite (Desenvolvimento)

```python
# Configuração automática no main.py
DATABASE_URL = 'sqlite:///dietia.db'
```

### PostgreSQL (Produção)

```bash
# Instalar PostgreSQL
sudo apt install postgresql postgresql-contrib

# Criar banco e usuário
sudo -u postgres psql
CREATE DATABASE dietia;
CREATE USER dietia_user WITH PASSWORD 'senha_segura';
GRANT ALL PRIVILEGES ON DATABASE dietia TO dietia_user;
```

```python
# Atualizar configuração
DATABASE_URL = 'postgresql://dietia_user:senha_segura@localhost/dietia'
```

## Configuração de Segurança

### HTTPS com Let's Encrypt

```bash
# Instalar Certbot
sudo apt install certbot python3-certbot-nginx

# Obter certificado
sudo certbot --nginx -d seu-dominio.com

# Renovação automática
sudo crontab -e
# Adicionar: 0 12 * * * /usr/bin/certbot renew --quiet
```

### Variáveis de Ambiente

```bash
# .env para produção
FLASK_ENV=production
SECRET_KEY=sua_chave_secreta_muito_segura
DATABASE_URL=postgresql://user:pass@localhost/dietia
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=seu-email@gmail.com
EMAIL_PASS=sua_senha_app
```

### Firewall

```bash
# Configurar UFW
sudo ufw enable
sudo ufw allow ssh
sudo ufw allow 80
sudo ufw allow 443
sudo ufw allow 5678  # N8N (apenas se necessário)
```

## Monitoramento e Logs

### Configuração de Logs

```python
# logging_config.py
import logging
from logging.handlers import RotatingFileHandler

def setup_logging(app):
    if not app.debug:
        file_handler = RotatingFileHandler(
            'logs/dietia.log', 
            maxBytes=10240000, 
            backupCount=10
        )
        file_handler.setFormatter(logging.Formatter(
            '%(asctime)s %(levelname)s: %(message)s'
        ))
        file_handler.setLevel(logging.INFO)
        app.logger.addHandler(file_handler)
        app.logger.setLevel(logging.INFO)
```

### Monitoramento com PM2

```bash
# Monitorar processos
pm2 status
pm2 logs dietia-backend
pm2 monit

# Configurar alertas
pm2 install pm2-server-monit
```

## Backup e Recuperação

### Backup Automático

```bash
#!/bin/bash
# backup.sh
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/backup/dietia"

# Backup do banco de dados
cp /home/dietia/dietia-app/diet-api/dietia.db $BACKUP_DIR/db_$DATE.db

# Backup dos arquivos de configuração
tar -czf $BACKUP_DIR/config_$DATE.tar.gz /home/dietia/dietia-app

# Manter apenas últimos 7 backups
find $BACKUP_DIR -name "*.db" -mtime +7 -delete
find $BACKUP_DIR -name "*.tar.gz" -mtime +7 -delete
```

### Agendamento de Backup

```bash
# Adicionar ao crontab
crontab -e
# Backup diário às 2h da manhã
0 2 * * * /home/dietia/scripts/backup.sh
```

## Solução de Problemas

### Problemas Comuns

#### Frontend não carrega
```bash
# Verificar se o serviço está rodando
curl http://localhost:5173
# Verificar logs do Nginx
sudo tail -f /var/log/nginx/error.log
```

#### Backend não responde
```bash
# Verificar processo
pm2 status
# Verificar logs
pm2 logs dietia-backend
# Reiniciar se necessário
pm2 restart dietia-backend
```

#### Banco de dados corrompido
```bash
# Verificar integridade SQLite
sqlite3 dietia.db "PRAGMA integrity_check;"
# Restaurar backup se necessário
cp /backup/dietia/db_latest.db dietia.db
```

### Logs Importantes

```bash
# Logs do sistema
sudo tail -f /var/log/syslog

# Logs do Nginx
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log

# Logs da aplicação
tail -f /home/dietia/dietia-app/logs/dietia.log
```

## Manutenção

### Atualizações Regulares

```bash
# Atualizar dependências Node.js
cd diet-quiz-app
npm audit fix
npm update

# Atualizar dependências Python
cd diet-api
source venv/bin/activate
pip list --outdated
pip install --upgrade package_name
```

### Limpeza de Dados

```bash
# Limpar logs antigos
find /var/log -name "*.log" -mtime +30 -delete

# Limpar cache temporário
rm -rf /tmp/dietia_*

# Otimizar banco SQLite
sqlite3 dietia.db "VACUUM;"
```

### Monitoramento de Performance

```bash
# Monitorar uso de recursos
htop
df -h
free -h

# Monitorar conexões de rede
netstat -tulpn | grep :5000
```

---

**Nota**: Este guia cobre os cenários mais comuns de instalação e deploy. Para configurações específicas ou ambientes customizados, consulte a documentação técnica detalhada ou entre em contato com a equipe de desenvolvimento.

