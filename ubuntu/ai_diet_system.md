# Sistema de IA para Geração de Dietas

## Estratégias Possíveis

### 1. API de LLM Gratuita (Gemini/OpenAI)
**Vantagens:**
- Geração mais natural e variada
- Melhor compreensão de contexto
- Capacidade de criar receitas criativas

**Desvantagens:**
- Dependência de API externa
- Limites de uso gratuito
- Possível custo futuro

### 2. Sistema Baseado em Regras + Templates
**Vantagens:**
- Totalmente gratuito
- Controle total sobre a geração
- Sem dependências externas
- Mais rápido

**Desvantagens:**
- Menos variação natural
- Requer mais desenvolvimento inicial

### 3. Híbrido (Recomendado)
**Combinação:**
- Base de dados de alimentos e receitas
- Sistema de regras para balanceamento nutricional
- Templates inteligentes para variação
- Opção de usar LLM quando disponível

## Implementação Proposta

### Estrutura de Dados
```python
# Base de alimentos com informações nutricionais
ALIMENTOS = {
    "proteinas": {
        "frango_grelhado": {"calorias": 165, "proteina": 31, "carbs": 0, "gordura": 3.6},
        "ovo_cozido": {"calorias": 155, "proteina": 13, "carbs": 1.1, "gordura": 11},
        # ...
    },
    "carboidratos": {
        "arroz_integral": {"calorias": 111, "proteina": 2.6, "carbs": 23, "gordura": 0.9},
        "batata_doce": {"calorias": 86, "proteina": 1.6, "carbs": 20, "gordura": 0.1},
        # ...
    },
    "vegetais": {
        "brocolos": {"calorias": 34, "proteina": 2.8, "carbs": 7, "gordura": 0.4},
        "cenoura": {"calorias": 41, "proteina": 0.9, "carbs": 10, "gordura": 0.2},
        # ...
    }
}
```

### Algoritmo de Geração
1. **Análise do Perfil**: Processar dados do quiz
2. **Cálculo Nutricional**: Distribuir calorias por refeição
3. **Seleção de Alimentos**: Baseado em preferências e restrições
4. **Balanceamento**: Garantir proporções adequadas de macronutrientes
5. **Variação**: Evitar repetição excessiva
6. **Formatação**: Criar apresentação amigável

### Personalização por Objetivo
- **Perda de peso**: Déficit calórico, mais proteínas, menos carboidratos
- **Ganho de massa**: Superávit calórico, alta proteína, carboidratos pré/pós treino
- **Manutenção**: Equilíbrio calórico, distribuição balanceada

### Considerações Especiais
- **Horários de treino**: Ajustar refeições pré/pós exercício
- **Restrições alimentares**: Filtrar alimentos incompatíveis
- **Preferências**: Priorizar alimentos favoritos
- **Orçamento**: Considerar custo dos ingredientes
- **Tempo de preparo**: Adaptar complexidade das receitas

