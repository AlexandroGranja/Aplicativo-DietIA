from flask import Blueprint, request, jsonify
from flask_cors import cross_origin
from src.models.user import db, User, Diet
from src.ai_diet_generator import generate_diet_for_user
from datetime import datetime, date
import json

ai_bp = Blueprint('ai', __name__)

@ai_bp.route('/generate-diet/<int:user_id>', methods=['POST'])
@cross_origin()
def generate_diet(user_id):
    """Endpoint para gerar uma nova dieta para um usuário"""
    try:
        user = User.query.get_or_404(user_id)
        
        # Verificar se já existe dieta para hoje
        today = date.today()
        existing_diet = Diet.query.filter_by(user_id=user.id, date=today).first()
        
        if existing_diet:
            return jsonify({
                'message': 'Dieta para hoje já existe',
                'diet_id': existing_diet.id,
                'diet': existing_diet.to_dict()
            }), 200
        
        # Converter dados do usuário para formato esperado pela IA
        user_data = user.to_dict()
        
        # Gerar dieta usando IA
        result = generate_diet_for_user(user_data)
        
        if not result["success"]:
            return jsonify({'error': 'Erro ao gerar dieta'}), 500
        
        diet_data = result["diet_data"]
        formatted_diet = result["formatted_diet"]
        
        # Salvar dieta no banco
        new_diet = Diet(
            user_id=user.id,
            date=today,
            breakfast=json.dumps(diet_data["refeicoes"].get("cafe_da_manha", {})),
            morning_snack=json.dumps(diet_data["refeicoes"].get("lanche_manha", {})),
            lunch=json.dumps(diet_data["refeicoes"].get("almoco", {})),
            afternoon_snack=json.dumps(diet_data["refeicoes"].get("lanche_tarde", {})),
            dinner=json.dumps(diet_data["refeicoes"].get("jantar", {})),
            evening_snack=json.dumps(diet_data["refeicoes"].get("ceia", {})),
            total_calories=diet_data["resumo_nutricional"]["calorias_total"],
            total_protein=diet_data["resumo_nutricional"]["proteina_total"],
            total_carbs=diet_data["resumo_nutricional"]["carbs_total"],
            total_fat=diet_data["resumo_nutricional"]["gordura_total"],
            ai_prompt_used="Sistema baseado em regras nutricionais"
        )
        
        db.session.add(new_diet)
        db.session.commit()
        
        return jsonify({
            'message': 'Dieta gerada com sucesso!',
            'diet_id': new_diet.id,
            'formatted_diet': formatted_diet,
            'diet_data': diet_data,
            'nutritional_summary': diet_data["resumo_nutricional"]
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': f'Erro ao gerar dieta: {str(e)}'}), 500

@ai_bp.route('/regenerate-diet/<int:user_id>', methods=['POST'])
@cross_origin()
def regenerate_diet(user_id):
    """Endpoint para regenerar a dieta de hoje (sobrescrever)"""
    try:
        user = User.query.get_or_404(user_id)
        
        # Remover dieta existente de hoje se houver
        today = date.today()
        existing_diet = Diet.query.filter_by(user_id=user.id, date=today).first()
        if existing_diet:
            db.session.delete(existing_diet)
            db.session.commit()
        
        # Gerar nova dieta
        return generate_diet(user_id)
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': f'Erro ao regenerar dieta: {str(e)}'}), 500

@ai_bp.route('/diet/<int:diet_id>/formatted', methods=['GET'])
@cross_origin()
def get_formatted_diet(diet_id):
    """Endpoint para obter dieta formatada para apresentação"""
    try:
        diet = Diet.query.get_or_404(diet_id)
        user = diet.user
        
        # Reconstruir dados da dieta
        diet_data = {
            "data": diet.date.isoformat(),
            "usuario": user.name,
            "objetivo": user.main_goal,
            "calorias_alvo": user.daily_calories,
            "refeicoes": {},
            "resumo_nutricional": {
                "calorias_total": diet.total_calories or 0,
                "proteina_total": diet.total_protein or 0,
                "carbs_total": diet.total_carbs or 0,
                "gordura_total": diet.total_fat or 0
            }
        }
        
        # Adicionar refeições se existirem
        if diet.breakfast:
            diet_data["refeicoes"]["cafe_da_manha"] = json.loads(diet.breakfast)
        if diet.morning_snack:
            diet_data["refeicoes"]["lanche_manha"] = json.loads(diet.morning_snack)
        if diet.lunch:
            diet_data["refeicoes"]["almoco"] = json.loads(diet.lunch)
        if diet.afternoon_snack:
            diet_data["refeicoes"]["lanche_tarde"] = json.loads(diet.afternoon_snack)
        if diet.dinner:
            diet_data["refeicoes"]["jantar"] = json.loads(diet.dinner)
        if diet.evening_snack:
            diet_data["refeicoes"]["ceia"] = json.loads(diet.evening_snack)
        
        # Importar formatador
        from src.ai_diet_generator import DietGenerator
        generator = DietGenerator()
        formatted_diet = generator.format_diet_for_user(diet_data, user.language or "pt")
        
        return jsonify({
            'diet_id': diet.id,
            'formatted_diet': formatted_diet,
            'diet_data': diet_data
        }), 200
        
    except Exception as e:
        return jsonify({'error': f'Erro ao formatar dieta: {str(e)}'}), 500

@ai_bp.route('/test-generation', methods=['POST'])
@cross_origin()
def test_generation():
    """Endpoint para testar geração de dieta sem salvar no banco"""
    try:
        data = request.get_json()
        
        if not data:
            return jsonify({'error': 'Dados não fornecidos'}), 400
        
        print("Dados recebidos do frontend:", data)
        
        # Gerar dieta usando IA
        result = generate_diet_for_user(data)
        
        if not result["success"]:
            return jsonify({'error': 'Erro ao gerar dieta'}), 500
        
        return jsonify({
            'message': 'Dieta de teste gerada com sucesso!',
            'formatted_diet': result["formatted_diet"],
            'diet_data': result["diet_data"]
        }), 200
        
    except Exception as e:
        return jsonify({'error': f'Erro ao gerar dieta de teste: {str(e)}'}), 500

