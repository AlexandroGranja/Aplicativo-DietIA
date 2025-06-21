"""
Sistema de IA para Geração de Dietas Personalizadas
Combina base de dados nutricional com algoritmos inteligentes
"""

import json
import random
from datetime import datetime, date
from typing import Dict, List, Any, Optional

class FoodDatabase:
    """Base de dados de alimentos com informações nutricionais"""
    
    def __init__(self):
        self.foods = {
            "proteinas": {
                "frango_grelhado": {
                    "nome": "Frango grelhado",
                    "calorias_100g": 165,
                    "proteina": 31,
                    "carbs": 0,
                    "gordura": 3.6,
                    "porcao_padrao": 150,
                    "custo": "medio",
                    "preparo": "simples"
                },
                "ovo_cozido": {
                    "nome": "Ovo cozido",
                    "calorias_100g": 155,
                    "proteina": 13,
                    "carbs": 1.1,
                    "gordura": 11,
                    "porcao_padrao": 60,
                    "custo": "baixo",
                    "preparo": "simples"
                },
                "peixe_grelhado": {
                    "nome": "Peixe grelhado",
                    "calorias_100g": 206,
                    "proteina": 22,
                    "carbs": 0,
                    "gordura": 12,
                    "porcao_padrao": 120,
                    "custo": "alto",
                    "preparo": "medio"
                },
                "tofu": {
                    "nome": "Tofu",
                    "calorias_100g": 76,
                    "proteina": 8,
                    "carbs": 1.9,
                    "gordura": 4.8,
                    "porcao_padrao": 100,
                    "custo": "medio",
                    "preparo": "simples",
                    "vegetariano": True
                }
            },
            "carboidratos": {
                "arroz_integral": {
                    "nome": "Arroz integral",
                    "calorias_100g": 111,
                    "proteina": 2.6,
                    "carbs": 23,
                    "gordura": 0.9,
                    "porcao_padrao": 100,
                    "custo": "baixo",
                    "preparo": "simples"
                },
                "batata_doce": {
                    "nome": "Batata doce",
                    "calorias_100g": 86,
                    "proteina": 1.6,
                    "carbs": 20,
                    "gordura": 0.1,
                    "porcao_padrao": 150,
                    "custo": "baixo",
                    "preparo": "simples"
                },
                "quinoa": {
                    "nome": "Quinoa",
                    "calorias_100g": 120,
                    "proteina": 4.4,
                    "carbs": 22,
                    "gordura": 1.9,
                    "porcao_padrao": 80,
                    "custo": "alto",
                    "preparo": "medio"
                },
                "aveia": {
                    "nome": "Aveia",
                    "calorias_100g": 389,
                    "proteina": 16.9,
                    "carbs": 66,
                    "gordura": 6.9,
                    "porcao_padrao": 40,
                    "custo": "baixo",
                    "preparo": "simples"
                }
            },
            "vegetais": {
                "brocolos": {
                    "nome": "Brócolis",
                    "calorias_100g": 34,
                    "proteina": 2.8,
                    "carbs": 7,
                    "gordura": 0.4,
                    "porcao_padrao": 100,
                    "custo": "medio",
                    "preparo": "simples"
                },
                "cenoura": {
                    "nome": "Cenoura",
                    "calorias_100g": 41,
                    "proteina": 0.9,
                    "carbs": 10,
                    "gordura": 0.2,
                    "porcao_padrao": 80,
                    "custo": "baixo",
                    "preparo": "simples"
                },
                "espinafre": {
                    "nome": "Espinafre",
                    "calorias_100g": 23,
                    "proteina": 2.9,
                    "carbs": 3.6,
                    "gordura": 0.4,
                    "porcao_padrao": 100,
                    "custo": "medio",
                    "preparo": "simples"
                }
            },
            "frutas": {
                "banana": {
                    "nome": "Banana",
                    "calorias_100g": 89,
                    "proteina": 1.1,
                    "carbs": 23,
                    "gordura": 0.3,
                    "porcao_padrao": 120,
                    "custo": "baixo",
                    "preparo": "nenhum"
                },
                "maca": {
                    "nome": "Maçã",
                    "calorias_100g": 52,
                    "proteina": 0.3,
                    "carbs": 14,
                    "gordura": 0.2,
                    "porcao_padrao": 150,
                    "custo": "baixo",
                    "preparo": "nenhum"
                }
            },
            "gorduras": {
                "azeite": {
                    "nome": "Azeite de oliva",
                    "calorias_100g": 884,
                    "proteina": 0,
                    "carbs": 0,
                    "gordura": 100,
                    "porcao_padrao": 10,
                    "custo": "medio",
                    "preparo": "nenhum"
                },
                "abacate": {
                    "nome": "Abacate",
                    "calorias_100g": 160,
                    "proteina": 2,
                    "carbs": 9,
                    "gordura": 15,
                    "porcao_padrao": 100,
                    "custo": "medio",
                    "preparo": "nenhum"
                }
            }
        }
    
    def get_foods_by_category(self, category: str) -> Dict:
        """Retorna alimentos de uma categoria específica"""
        return self.foods.get(category, {})
    
    def filter_foods(self, category: str, restrictions: List[str] = None, 
                    budget: str = "medio", vegetarian: bool = False) -> Dict:
        """Filtra alimentos baseado em restrições e preferências"""
        foods = self.get_foods_by_category(category)
        filtered = {}
        
        for food_id, food_data in foods.items():
            # Verificar se é vegetariano quando necessário
            if vegetarian and not food_data.get("vegetariano", False):
                if category == "proteinas":  # Só aplicar filtro vegetariano para proteínas
                    continue
            
            # Verificar orçamento
            food_cost = food_data.get("custo", "medio")
            if budget == "baixo" and food_cost == "alto":
                continue
            
            # Verificar restrições (implementar conforme necessário)
            # Por exemplo, glúten, lactose, etc.
            
            filtered[food_id] = food_data
        
        return filtered

class DietGenerator:
    """Gerador de dietas personalizadas baseado no perfil do usuário"""
    
    def __init__(self):
        self.food_db = FoodDatabase()
        self.meal_templates = {
            "cafe_da_manha": {
                "carboidratos": 0.4,
                "proteinas": 0.3,
                "gorduras": 0.2,
                "frutas": 0.1
            },
            "lanche_manha": {
                "frutas": 0.6,
                "proteinas": 0.4
            },
            "almoco": {
                "proteinas": 0.35,
                "carboidratos": 0.35,
                "vegetais": 0.25,
                "gorduras": 0.05
            },
            "lanche_tarde": {
                "frutas": 0.5,
                "carboidratos": 0.3,
                "proteinas": 0.2
            },
            "jantar": {
                "proteinas": 0.4,
                "vegetais": 0.35,
                "carboidratos": 0.2,
                "gorduras": 0.05
            }
        }
    
    def analyze_user_profile(self, user_data: Dict) -> Dict:
        """Analisa o perfil do usuário e define parâmetros da dieta"""
        profile = {
            "daily_calories": int(user_data.get("daily_calories", 2000)),
            "main_goal": user_data.get("main_goal", "manter_peso"),
            "vegetarian": "vegetariana" in user_data.get("special_diet", "").lower(),
            "budget": user_data.get("food_budget", "medio"),
            "cooking_time": user_data.get("cooking_time", "pouco_tempo"),
            "exercise_time": user_data.get("exercise_time"),
            "meals_per_day": int(user_data.get("meals_per_day", "3")),
            "allergies": user_data.get("allergies", ""),
            "dislikes": user_data.get("disliked_foods", ""),
            "preferences": user_data.get("favorite_foods", "")
        }
        
        # Ajustar distribuição calórica baseada no objetivo
        if profile["main_goal"] == "perder_peso":
            profile["protein_ratio"] = 0.35
            profile["carb_ratio"] = 0.35
            profile["fat_ratio"] = 0.30
        elif profile["main_goal"] == "ganhar_massa":
            profile["protein_ratio"] = 0.30
            profile["carb_ratio"] = 0.45
            profile["fat_ratio"] = 0.25
        else:  # manter peso
            profile["protein_ratio"] = 0.30
            profile["carb_ratio"] = 0.40
            profile["fat_ratio"] = 0.30
        
        return profile
    
    def distribute_calories_by_meal(self, profile: Dict) -> Dict:
        """Distribui as calorias diárias entre as refeições"""
        total_calories = profile["daily_calories"]
        meals_count = profile["meals_per_day"]
        
        if meals_count == 3:
            distribution = {
                "cafe_da_manha": 0.25,
                "almoco": 0.45,
                "jantar": 0.30
            }
        elif meals_count == 4:
            distribution = {
                "cafe_da_manha": 0.25,
                "lanche_manha": 0.10,
                "almoco": 0.40,
                "jantar": 0.25
            }
        elif meals_count == 5:
            distribution = {
                "cafe_da_manha": 0.20,
                "lanche_manha": 0.10,
                "almoco": 0.35,
                "lanche_tarde": 0.10,
                "jantar": 0.25
            }
        else:  # 6 refeições
            distribution = {
                "cafe_da_manha": 0.20,
                "lanche_manha": 0.10,
                "almoco": 0.30,
                "lanche_tarde": 0.10,
                "jantar": 0.20,
                "ceia": 0.10
            }
        
        # Calcular calorias por refeição
        meal_calories = {}
        for meal, percentage in distribution.items():
            meal_calories[meal] = int(total_calories * percentage)
        
        return meal_calories
    
    def generate_meal(self, meal_name: str, target_calories: int, profile: Dict) -> Dict:
        """Gera uma refeição específica baseada nas calorias alvo e perfil"""
        meal_template = self.meal_templates.get(meal_name, self.meal_templates["almoco"])
        meal = {
            "nome": meal_name.replace("_", " ").title(),
            "alimentos": [],
            "calorias_total": 0,
            "proteina_total": 0,
            "carbs_total": 0,
            "gordura_total": 0
        }
        
        # Para cada categoria no template da refeição
        for category, percentage in meal_template.items():
            category_calories = int(target_calories * percentage)
            
            # Filtrar alimentos disponíveis
            available_foods = self.food_db.filter_foods(
                category, 
                budget=profile["budget"],
                vegetarian=profile["vegetarian"]
            )
            
            if not available_foods:
                continue
            
            # Selecionar alimento aleatório da categoria
            food_id = random.choice(list(available_foods.keys()))
            food_data = available_foods[food_id]
            
            # Calcular porção necessária para atingir as calorias
            calories_per_100g = food_data["calorias_100g"]
            portion_needed = (category_calories / calories_per_100g) * 100
            
            # Ajustar para porção razoável
            portion_needed = max(20, min(portion_needed, 300))  # Entre 20g e 300g
            
            # Calcular valores nutricionais reais
            actual_calories = (portion_needed / 100) * calories_per_100g
            actual_protein = (portion_needed / 100) * food_data["proteina"]
            actual_carbs = (portion_needed / 100) * food_data["carbs"]
            actual_fat = (portion_needed / 100) * food_data["gordura"]
            
            # Adicionar à refeição
            meal["alimentos"].append({
                "nome": food_data["nome"],
                "quantidade": f"{portion_needed:.0f}g",
                "calorias": actual_calories,
                "proteina": actual_protein,
                "carbs": actual_carbs,
                "gordura": actual_fat
            })
            
            # Atualizar totais
            meal["calorias_total"] += actual_calories
            meal["proteina_total"] += actual_protein
            meal["carbs_total"] += actual_carbs
            meal["gordura_total"] += actual_fat
        
        return meal
    
    def generate_daily_diet(self, user_data: Dict) -> Dict:
        """Gera uma dieta completa para o dia"""
        profile = self.analyze_user_profile(user_data)
        meal_calories = self.distribute_calories_by_meal(profile)
        
        diet = {
            "data": date.today().isoformat(),
            "usuario": user_data.get("name", "Usuário"),
            "objetivo": profile["main_goal"],
            "calorias_alvo": profile["daily_calories"],
            "refeicoes": {},
            "resumo_nutricional": {
                "calorias_total": 0,
                "proteina_total": 0,
                "carbs_total": 0,
                "gordura_total": 0
            }
        }
        
        # Gerar cada refeição
        for meal_name, calories in meal_calories.items():
            meal = self.generate_meal(meal_name, calories, profile)
            diet["refeicoes"][meal_name] = meal
            
            # Atualizar resumo nutricional
            diet["resumo_nutricional"]["calorias_total"] += meal["calorias_total"]
            diet["resumo_nutricional"]["proteina_total"] += meal["proteina_total"]
            diet["resumo_nutricional"]["carbs_total"] += meal["carbs_total"]
            diet["resumo_nutricional"]["gordura_total"] += meal["gordura_total"]
        
        return diet
    
    def format_diet_for_user(self, diet: Dict, language: str = "pt") -> str:
        """Formata a dieta para apresentação ao usuário"""
        if language == "pt":
            formatted = f"""
🍽️ **DIETA PERSONALIZADA - {diet['data']}**

👤 **Usuário:** {diet['usuario']}
🎯 **Objetivo:** {diet['objetivo'].replace('_', ' ').title()}
📊 **Calorias Alvo:** {diet['calorias_alvo']} kcal

"""
            
            for meal_name, meal_data in diet["refeicoes"].items():
                formatted += f"\n🕐 **{meal_data['nome'].upper()}**\n"
                formatted += f"📈 Calorias: {meal_data['calorias_total']:.0f} kcal\n\n"
                
                for food in meal_data["alimentos"]:
                    formatted += f"• {food['nome']} - {food['quantidade']}\n"
                
                formatted += "\n"
            
            formatted += f"""
📊 **RESUMO NUTRICIONAL DIÁRIO**
• Calorias: {diet['resumo_nutricional']['calorias_total']:.0f} kcal
• Proteínas: {diet['resumo_nutricional']['proteina_total']:.1f}g
• Carboidratos: {diet['resumo_nutricional']['carbs_total']:.1f}g
• Gorduras: {diet['resumo_nutricional']['gordura_total']:.1f}g

💡 **Dicas:**
• Beba pelo menos 2 litros de água ao longo do dia
• Faça as refeições nos horários regulares
• Ajuste as porções conforme sua fome e saciedade
"""
        
        return formatted

# Função principal para integração com a API
def generate_diet_for_user(user_data: Dict) -> Dict:
    """Função principal para gerar dieta baseada nos dados do usuário"""
    generator = DietGenerator()
    diet = generator.generate_daily_diet(user_data)
    formatted_diet = generator.format_diet_for_user(diet, user_data.get("language", "pt"))
    
    return {
        "diet_data": diet,
        "formatted_diet": formatted_diet,
        "success": True
    }

