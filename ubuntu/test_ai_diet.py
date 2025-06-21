"""
Teste do Sistema de IA para Geração de Dietas
"""

import sys
import os
sys.path.append('/home/ubuntu/diet-api/src')

from ai_diet_generator import generate_diet_for_user

# Dados de teste simulando um usuário
test_user_data = {
    "name": "João Silva",
    "age": 30,
    "gender": "masculino",
    "height": 175,
    "current_weight": 80,
    "target_weight": 75,
    "main_goal": "perder_peso",
    "daily_calories": 1800,
    "meals_per_day": "5",
    "exercise_regularly": "sim",
    "exercise_type": ["Musculação", "Cardio"],
    "vegetarian": False,
    "special_diet": "",
    "food_budget": "medio",
    "cooking_time": "pouco_tempo",
    "allergies": "",
    "disliked_foods": "brócolis",
    "favorite_foods": "frango, arroz, banana",
    "language": "pt"
}

print("🧪 Testando Sistema de IA para Geração de Dietas...")
print("=" * 50)

try:
    result = generate_diet_for_user(test_user_data)
    
    if result["success"]:
        print("✅ Dieta gerada com sucesso!")
        print("\n📋 DIETA FORMATADA:")
        print(result["formatted_diet"])
        
        print("\n📊 DADOS ESTRUTURADOS:")
        diet_data = result["diet_data"]
        print(f"Usuário: {diet_data['usuario']}")
        print(f"Objetivo: {diet_data['objetivo']}")
        print(f"Calorias Alvo: {diet_data['calorias_alvo']}")
        print(f"Refeições: {len(diet_data['refeicoes'])}")
        
        print("\n🍽️ RESUMO DAS REFEIÇÕES:")
        for meal_name, meal_data in diet_data["refeicoes"].items():
            print(f"• {meal_data['nome']}: {meal_data['calorias_total']:.0f} kcal")
        
        print(f"\n📈 TOTAL NUTRICIONAL:")
        summary = diet_data["resumo_nutricional"]
        print(f"• Calorias: {summary['calorias_total']:.0f} kcal")
        print(f"• Proteínas: {summary['proteina_total']:.1f}g")
        print(f"• Carboidratos: {summary['carbs_total']:.1f}g")
        print(f"• Gorduras: {summary['gordura_total']:.1f}g")
        
    else:
        print("❌ Erro ao gerar dieta")
        
except Exception as e:
    print(f"❌ Erro durante o teste: {str(e)}")
    import traceback
    traceback.print_exc()

print("\n" + "=" * 50)
print("🏁 Teste concluído!")

