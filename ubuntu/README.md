# 🔥 DietIA - Sistema de Dieta Personalizada com IA

Um sistema completo de geração de dietas personalizadas usando inteligência artificial, com interface moderna e tema de fogo/nutrição.

## ✨ Características

- 🎨 **Design Moderno**: Interface com tema de fogo/nutrição, profissional e atraente
- 🌍 **Multilíngue**: Suporte completo para Português e Inglês
- 📱 **Responsivo**: Funciona perfeitamente em desktop, tablet e mobile
- ⚡ **Formulários Inteligentes**: Perguntas claras e objetivas, sem textos gigantes
- 🤖 **Integração IA**: Conecta com APIs de IA para geração de dietas
- 🔗 **n8n Ready**: Preparado para integração com n8n para automação
- 🎯 **UX Otimizada**: Experiência do usuário fluida e intuitiva

## 🚀 Tecnologias

### Frontend
- **React 18** - Framework principal
- **Vite** - Build tool e dev server
- **Tailwind CSS** - Estilização
- **Radix UI** - Componentes acessíveis
- **Lucide React** - Ícones modernos

### Backend
- **Python 3.13** - Linguagem principal
- **Flask** - Framework web
- **SQLAlchemy** - ORM
- **Flask-CORS** - CORS handling

### Integração
- **n8n** - Automação de workflows
- **APIs de IA** - Geração de dietas personalizadas

## 📦 Instalação

### Pré-requisitos
- Node.js 18+
- Python 3.13+
- npm ou yarn

### Frontend
```bash
cd ubuntu/diet-quiz-app
npm install
npm run dev
```

### Backend
```bash
cd ubuntu/diet-api
python -m venv venv
source venv/bin/activate  # Linux/Mac
# ou
venv\Scripts\activate     # Windows
pip install -r requirements.txt
python src/main.py
```

## 🎨 Design System

### Cores Principais
- **Laranja**: `#f97316` (Orange-500)
- **Vermelho**: `#dc2626` (Red-600)
- **Gradientes**: Combinações de laranja para vermelho

### Componentes
- **Botões**: Gradientes com hover effects
- **Inputs**: Bordas arredondadas com foco laranja
- **Cards**: Sombras suaves com bordas arredondadas
- **Animações**: Transições suaves e efeitos de hover

### Tema de Fogo
- Ícones de fogo (🔥) e elementos relacionados
- Gradientes que simulam chamas
- Animações de brilho e pulsação
- Cores quentes (laranja, vermelho, amarelo)

## 🌍 Internacionalização

### Português (pt)
- Textos concisos e objetivos
- Perguntas diretas
- Placeholders informativos

### English (en)
- Clear and concise text
- Direct questions
- Informative placeholders

## 📋 Formulário

### Passos do Quiz
1. **Dados Pessoais** - Informações básicas
2. **Objetivos** - Meta principal com ícones
3. **Rotina** - Horários e refeições
4. **Exercícios** - Atividade física
5. **Preferências** - Gostos alimentares
6. **Restrições** - Alergias e intolerâncias
7. **Alimentação Atual** - Hábitos atuais
8. **Conclusão** - Resumo e envio

### Validação
- Campos obrigatórios marcados
- Validação em tempo real
- Mensagens de erro claras

## 🔗 Integração n8n

### Webhook
```
POST https://your-n8n-instance.com/webhook/diet-quiz
```

### Payload
```json
{
  "name": "string",
  "age": "number",
  "gender": "string",
  "height": "number",
  "currentWeight": "number",
  "targetWeight": "number",
  "mainGoal": "string",
  "language": "string",
  "timestamp": "ISO string",
  "source": "diet-quiz-app",
  "version": "1.0.0"
}
```

## 🚀 Deploy

### Frontend (Vercel/Netlify)
```bash
npm run build
# Deploy da pasta dist/
```

### Backend (Railway/Heroku)
```bash
# Configurar variáveis de ambiente
# Deploy do código Python
```

### n8n (Docker)
```bash
docker run -it --rm --name n8n -p 5678:5678 n8nio/n8n
```

## 📊 Monitoramento

- Logs de execução no n8n
- Métricas de performance
- Alertas de erro
- Analytics de uso

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📝 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

## 🎯 Roadmap

- [ ] Integração com WhatsApp
- [ ] App mobile (React Native)
- [ ] Dashboard de acompanhamento
- [ ] Sistema de notificações push
- [ ] Integração com wearables
- [ ] Análise de progresso com IA

## 📞 Suporte

Para suporte, envie um email para suporte@dietia.com ou abra uma issue no GitHub.

---

🔥 **DietIA** - Transforme sua alimentação com o poder da IA!
