
# Documento de Arquitetura do Aplicativo de Dieta com IA

## 1. Introdução

Este documento descreve a arquitetura proposta para o aplicativo de dieta com IA, que visa fornecer dietas diárias personalizadas aos usuários de forma gratuita, com integração via WhatsApp. O sistema será projetado para ser escalável, flexível e fácil de usar, atendendo às necessidades de usuários que buscam um plano alimentar adaptado às suas preferências e restrições.

## 2. Requisitos

### 2.1. Requisitos Funcionais

*   **Cadastro de Usuário:** O usuário deve ser capaz de se cadastrar no sistema, fornecendo informações básicas como nome e calorias diárias permitidas.
*   **Quiz Inicial:** O sistema deve apresentar um quiz detalhado ao usuário para coletar informações sobre:
    *   Horário de acordar e dormir.
    *   Horário de treino (se houver).
    *   Preferências alimentares (o que gosta de comer).
    *   Restrições alimentares (o que não gosta de comer).
    *   Alergias alimentares.
    *   Outras informações relevantes para a criação da dieta (ex: tipo de dieta, objetivos).
*   **Geração de Dieta Personalizada:** Com base nas informações do quiz e nas calorias diárias, a IA deve gerar uma dieta diferente ou semelhante ao que o usuário come, adaptada para o dia todo.
*   **Envio Diário da Dieta:** A dieta gerada deve ser enviada diariamente ao usuário via WhatsApp no primeiro horário do dia (definido pelo usuário no quiz).
*   **Suporte a Múltiplos Idiomas:** O aplicativo deve suportar, no mínimo, os idiomas Português (Brasil) e Inglês.
*   **Gratuidade:** O serviço principal de geração e envio de dietas deve ser gratuito para o usuário.
*   **Integração com WhatsApp:** A comunicação com o usuário para o envio da dieta deve ser feita através do WhatsApp.
*   **Integração com N8N:** O N8N será utilizado como ferramenta de automação para orquestrar o fluxo de dados entre os componentes e a integração com o WhatsApp.

### 2.2. Requisitos Não Funcionais

*   **Desempenho:** A geração da dieta e o envio via WhatsApp devem ser rápidos e eficientes.
*   **Segurança:** As informações do usuário e os dados de dieta devem ser armazenados e transmitidos de forma segura.
*   **Disponibilidade:** O sistema deve estar disponível 24/7 para garantir o envio diário das dietas.
*   **Escalabilidade:** A arquitetura deve permitir o crescimento do número de usuários e a adição de novas funcionalidades sem degradação significativa do desempenho.
*   **Manutenibilidade:** O código deve ser bem estruturado, documentado e fácil de manter.
*   **Usabilidade:** A interface do quiz deve ser intuitiva e fácil de usar.

## 3. Arquitetura do Sistema

A arquitetura do sistema será dividida em módulos, cada um com responsabilidades específicas, garantindo modularidade e facilitando a manutenção e escalabilidade. A comunicação entre os módulos será feita principalmente via APIs RESTful e webhooks.

### 3.1. Componentes Principais

*   **Frontend (Interface Web):** Será a interface principal para o usuário interagir com o quiz e, futuramente, com outras funcionalidades do aplicativo. Será desenvolvido em React para garantir uma experiência de usuário responsiva e dinâmica.
*   **Backend (API):** Servirá como o cérebro do aplicativo, gerenciando a lógica de negócios, a comunicação com o banco de dados e a integração com a IA. Será desenvolvido em Python (Flask ou FastAPI) devido à sua robustez e ecossistema rico para IA.
*   **Banco de Dados:** Armazenará todas as informações do usuário, dados do quiz, dietas geradas e histórico. Será um banco de dados relacional (PostgreSQL) ou NoSQL (MongoDB), dependendo da flexibilidade necessária para os dados da dieta.
*   **Módulo de IA (Inteligência Artificial):** Responsável por processar as informações do quiz e gerar as dietas personalizadas. Pode ser um modelo de linguagem grande (LLM) ou um modelo de IA treinado especificamente para geração de dietas.
*   **N8N (Automação e Integração):** Atuará como a camada de orquestração, conectando o backend com a WhatsApp Business API e gerenciando o fluxo de envio diário das dietas.
*   **WhatsApp Business API:** O canal de comunicação para enviar as dietas aos usuários.

### 3.2. Fluxo de Funcionamento

1.  **Cadastro e Quiz:**
    *   O usuário acessa a interface web (Frontend).
    *   Preenche o quiz inicial com suas informações e preferências.
    *   Os dados do quiz são enviados para o Backend via API.
    *   O Backend armazena os dados do usuário e do quiz no Banco de Dados.
2.  **Geração da Dieta (Manual ou Agendada):**
    *   **Primeira Geração (após quiz):** O Backend, após o quiz, pode acionar imediatamente o Módulo de IA para gerar a primeira dieta.
    *   **Geração Diária (agendada):** Um agendador (cron job no Backend ou funcionalidade do N8N) aciona o Backend diariamente no horário definido pelo usuário.
    *   O Backend recupera as informações do usuário e do quiz do Banco de Dados.
    *   O Backend envia essas informações para o Módulo de IA via API.
    *   O Módulo de IA processa os dados e gera a dieta personalizada.
    *   A dieta gerada é retornada ao Backend.
    *   O Backend armazena a dieta gerada no Banco de Dados (histórico).
3.  **Envio da Dieta via WhatsApp:**
    *   O Backend (ou N8N, dependendo da arquitetura final) aciona um workflow no N8N, passando a dieta gerada e o número de telefone do usuário.
    *   O N8N, através da integração com a WhatsApp Business API, envia a dieta para o usuário.

## 4. Tecnologias Propostas

*   **Frontend:** React, HTML, CSS, JavaScript.
*   **Backend:** Python (Flask ou FastAPI).
*   **Banco de Dados:** PostgreSQL (para dados estruturados de usuário e quiz) e/ou MongoDB (para dietas, se a estrutura for mais flexível).
*   **IA:** Modelos de linguagem (como Gemini, GPT) via API, ou um modelo de IA customizado desenvolvido em Python (TensorFlow/PyTorch) se a complexidade justificar.
*   **Automação/Integração:** N8N.
*   **Mensageria:** WhatsApp Business API.

## 5. Próximos Passos

Com base nesta arquitetura inicial, os próximos passos incluem aprofundar em cada componente, detalhar as APIs, definir o esquema exato do banco de dados e iniciar o desenvolvimento do quiz e da estrutura de dados.





## 6. Considerações sobre Gratuidade

Um requisito fundamental do projeto é que o aplicativo seja gratuito para o usuário final. Isso influencia diretamente a escolha das tecnologias e serviços:

*   **Frontend (React), Backend (Python - Flask/FastAPI), Banco de Dados (PostgreSQL/MongoDB):** Todas essas tecnologias são open-source e podem ser utilizadas sem custos de licença. A hospedagem inicial pode ser feita em plataformas com planos gratuitos (ex: Vercel para frontend, Heroku ou PythonAnywhere para backend com limitações, ou auto-hospedagem).
*   **N8N:** Possui uma versão comunitária (Community Edition) que pode ser auto-hospedada gratuitamente, oferecendo todas as funcionalidades necessárias para a automação dos workflows.
*   **Módulo de IA:**
    *   **APIs de Modelos de Linguagem (LLMs):** Serviços como Gemini ou GPT-3.5-turbo oferecem camadas gratuitas com limites de uso. Para um volume maior, pode ser necessário considerar custos ou modelos open-source auto-hospedados (ex: Llama, Mixtral), que demandariam mais infraestrutura.
    *   **Modelo Customizado:** Desenvolver e treinar um modelo de IA customizado seria mais complexo e exigiria recursos de computação para treinamento e inferência, mas o modelo em si seria de propriedade e sem custo de API.
*   **WhatsApp Business API:** Este é o componente mais desafiador em termos de gratuidade. A API oficial do WhatsApp Business geralmente envolve custos por conversa ou taxas de provedores de soluções de negócios (BSPs). Para manter a gratuidade total, algumas alternativas podem ser consideradas:
    1.  **Foco Inicial em Notificações Web/Email:** Lançar o aplicativo inicialmente com notificações via web (Web Push) ou e-mail, que são mais fáceis de implementar gratuitamente.
    2.  **Explorar APIs Não Oficiais (com ressalvas):** Existem bibliotecas não oficiais para interagir com o WhatsApp, mas elas são instáveis, podem violar os termos de serviço do WhatsApp e levar ao bloqueio de números. **Esta opção não é recomendada para um projeto sério e de longo prazo.**
    3.  **Limitar o Uso do WhatsApp:** Se uma solução gratuita ou de baixo custo para a API oficial for encontrada (alguns provedores podem ter planos de entrada limitados), o uso do WhatsApp pode ser restrito a um número específico de usuários ou mensagens.
    4.  **Modelo Freemium Futuro:** Oferecer a funcionalidade básica gratuitamente e, futuramente, adicionar recursos premium (incluindo integração mais robusta com WhatsApp) que poderiam cobrir os custos.

**Decisão para a Fase Inicial:** Dada a complexidade e os custos associados à WhatsApp Business API, a arquitetura inicial focará em uma **solução web completa com a possibilidade de notificações via e-mail ou Web Push**. A integração com WhatsApp será mantida como um objetivo desejável, mas sua implementação dependerá da viabilidade de uma solução gratuita ou de baixíssimo custo, a ser pesquisada em uma fase posterior ou considerada como uma melhoria futura. O N8N ainda será útil para orquestrar as notificações por e-mail/web push e a lógica da IA.


