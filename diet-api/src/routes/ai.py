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


@ai_bp.route('/ingest-diet/<int:user_id>', methods=['POST'])
@cross_origin()
def ingest_diet(user_id):
    """Endpoint para ingerir dieta gerada externamente (ex: n8n/Agente)
    Espera um JSON com estrutura próxima de diet_data usada internamente.
    """
    try:
        user = User.query.get_or_404(user_id)
        body = request.get_json() or {}

        # Aceita dois formatos: diet_data diretamente ou um envelope {diet_data: ..., formatted_diet: ...}
        incoming_diet = body.get('diet_data') or body.get('diet') or body

        if not isinstance(incoming_diet, dict):
            return jsonify({'error': 'Formato de dieta inválido'}), 400

        # Normalizar chaves esperadas
        meals = incoming_diet.get('refeicoes') or incoming_diet.get('meals') or {}
        summary = incoming_diet.get('resumo_nutricional') or incoming_diet.get('summary') or {}

        today = date.today()

        # Se já existir, apaga de hoje para sobrescrever
        existing = Diet.query.filter_by(user_id=user.id, date=today).first()
        if existing:
            db.session.delete(existing)
            db.session.commit()

        new_diet = Diet(
            user_id=user.id,
            date=today,
            breakfast=json.dumps(meals.get('cafe_da_manha') or meals.get('breakfast') or {}),
            morning_snack=json.dumps(meals.get('lanche_manha') or meals.get('morning_snack') or {}),
            lunch=json.dumps(meals.get('almoco') or meals.get('lunch') or {}),
            afternoon_snack=json.dumps(meals.get('lanche_tarde') or meals.get('afternoon_snack') or {}),
            dinner=json.dumps(meals.get('jantar') or meals.get('dinner') or {}),
            evening_snack=json.dumps(meals.get('ceia') or meals.get('evening_snack') or {}),
            total_calories=summary.get('calorias_total') or summary.get('calories_total'),
            total_protein=summary.get('proteina_total') or summary.get('protein_total'),
            total_carbs=summary.get('carbs_total') or summary.get('carbohydrates_total'),
            total_fat=summary.get('gordura_total') or summary.get('fat_total'),
            ai_prompt_used=body.get('ai_prompt_used') or 'external_ingest'
        )

        db.session.add(new_diet)
        db.session.commit()

        # Formatar saída para WhatsApp (texto simples) usando o formatador existente
        from src.ai_diet_generator import DietGenerator
        generator = DietGenerator()

        # Reconstruir diet_data no formato padronizado
        rebuilt = {
            'data': today.isoformat(),
            'usuario': user.name,
            'objetivo': user.main_goal,
            'calorias_alvo': user.daily_calories,
            'refeicoes': {},
            'resumo_nutricional': {
                'calorias_total': new_diet.total_calories or 0,
                'proteina_total': new_diet.total_protein or 0,
                'carbs_total': new_diet.total_carbs or 0,
                'gordura_total': new_diet.total_fat or 0
            }
        }
        if new_diet.breakfast: rebuilt['refeicoes']['cafe_da_manha'] = json.loads(new_diet.breakfast)
        if new_diet.morning_snack: rebuilt['refeicoes']['lanche_manha'] = json.loads(new_diet.morning_snack)
        if new_diet.lunch: rebuilt['refeicoes']['almoco'] = json.loads(new_diet.lunch)
        if new_diet.afternoon_snack: rebuilt['refeicoes']['lanche_tarde'] = json.loads(new_diet.afternoon_snack)
        if new_diet.dinner: rebuilt['refeicoes']['jantar'] = json.loads(new_diet.dinner)
        if new_diet.evening_snack: rebuilt['refeicoes']['ceia'] = json.loads(new_diet.evening_snack)

        formatted_diet = generator.format_diet_for_user(rebuilt, user.language or 'pt')

        return jsonify({
            'message': 'Dieta ingerida e salva com sucesso',
            'diet_id': new_diet.id,
            'formatted_diet': formatted_diet,
            'diet_data': rebuilt
        }), 201

    except Exception as e:
        db.session.rollback()
        return jsonify({'error': f'Erro ao ingerir dieta: {str(e)}'}), 500
