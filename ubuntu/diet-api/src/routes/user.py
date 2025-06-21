from flask import Blueprint, request, jsonify
from flask_cors import cross_origin
from src.models.user import db, User, Diet
from datetime import datetime, date
import json

user_bp = Blueprint('user', __name__)

@user_bp.route('/quiz', methods=['POST'])
@cross_origin()
def submit_quiz():
    """Endpoint para receber e salvar os dados do quiz nutricional"""
    try:
        data = request.get_json()
        
        if not data:
            return jsonify({'error': 'Dados não fornecidos'}), 400
        
        # Validar campos obrigatórios
        required_fields = ['name', 'age', 'gender', 'height', 'currentWeight', 'mainGoal', 'dailyCalories', 'wakeUpTime', 'sleepTime', 'mealsPerDay']
        missing_fields = [field for field in required_fields if not data.get(field)]
        
        if missing_fields:
            return jsonify({'error': f'Campos obrigatórios faltando: {", ".join(missing_fields)}'}), 400
        
        # Verificar se usuário já existe (por nome - em produção seria por email/telefone)
        existing_user = User.query.filter_by(name=data['name']).first()
        
        if existing_user:
            # Atualizar usuário existente
            user = existing_user
            # Atualizar campos
            for frontend_field, db_field in get_field_mapping().items():
                if frontend_field in data:
                    value = data[frontend_field]
                    
                    # Converter arrays para JSON string
                    if db_field in ['exercise_type', 'favorite_food', 'intolerances'] and isinstance(value, list):
                        value = json.dumps(value)
                    
                    # Converter strings vazias para None
                    if value == '':
                        value = None
                    
                    setattr(user, db_field, value)
            
            user.updated_at = datetime.utcnow()
        else:
            # Criar novo usuário
            user = User.from_dict(data)
        
        # Salvar no banco
        db.session.add(user)
        db.session.commit()
        
        # Gerar primeira dieta (placeholder - será implementado na próxima fase)
        # generate_initial_diet(user.id)
        
        return jsonify({
            'message': 'Quiz enviado com sucesso!',
            'user_id': user.id,
            'next_step': 'Sua primeira dieta será gerada em breve.'
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': f'Erro interno do servidor: {str(e)}'}), 500

@user_bp.route('/user/<int:user_id>', methods=['GET'])
@cross_origin()
def get_user(user_id):
    """Endpoint para buscar dados de um usuário"""
    try:
        user = User.query.get_or_404(user_id)
        return jsonify(user.to_dict()), 200
    except Exception as e:
        return jsonify({'error': f'Erro ao buscar usuário: {str(e)}'}), 500

@user_bp.route('/user/<int:user_id>/diets', methods=['GET'])
@cross_origin()
def get_user_diets(user_id):
    """Endpoint para buscar dietas de um usuário"""
    try:
        user = User.query.get_or_404(user_id)
        diets = Diet.query.filter_by(user_id=user_id).order_by(Diet.date.desc()).all()
        
        return jsonify({
            'user': user.name,
            'diets': [diet.to_dict() for diet in diets]
        }), 200
    except Exception as e:
        return jsonify({'error': f'Erro ao buscar dietas: {str(e)}'}), 500

@user_bp.route('/diet', methods=['POST'])
@cross_origin()
def create_diet():
    """Endpoint para criar uma nova dieta"""
    try:
        data = request.get_json()
        
        if not data or 'user_id' not in data:
            return jsonify({'error': 'user_id é obrigatório'}), 400
        
        user = User.query.get_or_404(data['user_id'])
        
        # Verificar se já existe dieta para hoje
        today = date.today()
        existing_diet = Diet.query.filter_by(user_id=user.id, date=today).first()
        
        if existing_diet:
            return jsonify({'error': 'Dieta para hoje já existe'}), 400
        
        # Criar nova dieta
        diet = Diet(
            user_id=user.id,
            date=data.get('date', today),
            breakfast=data.get('breakfast'),
            morning_snack=data.get('morning_snack'),
            lunch=data.get('lunch'),
            afternoon_snack=data.get('afternoon_snack'),
            dinner=data.get('dinner'),
            evening_snack=data.get('evening_snack'),
            total_calories=data.get('total_calories'),
            total_protein=data.get('total_protein'),
            total_carbs=data.get('total_carbs'),
            total_fat=data.get('total_fat'),
            ai_prompt_used=data.get('ai_prompt_used')
        )
        
        db.session.add(diet)
        db.session.commit()
        
        return jsonify({
            'message': 'Dieta criada com sucesso!',
            'diet_id': diet.id,
            'diet': diet.to_dict()
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': f'Erro ao criar dieta: {str(e)}'}), 500

@user_bp.route('/users', methods=['GET'])
@cross_origin()
def list_users():
    """Endpoint para listar todos os usuários (para desenvolvimento)"""
    try:
        users = User.query.all()
        return jsonify([{
            'id': user.id,
            'name': user.name,
            'age': user.age,
            'main_goal': user.main_goal,
            'daily_calories': user.daily_calories,
            'created_at': user.created_at.isoformat() if user.created_at else None
        } for user in users]), 200
    except Exception as e:
        return jsonify({'error': f'Erro ao listar usuários: {str(e)}'}), 500

def get_field_mapping():
    """Retorna o mapeamento de campos do frontend para o banco"""
    return {
        'name': 'name',
        'age': 'age',
        'gender': 'gender',
        'height': 'height',
        'currentWeight': 'current_weight',
        'targetWeight': 'target_weight',
        'mainGoal': 'main_goal',
        'timeframe': 'timeframe',
        'previousDiet': 'previous_diet',
        'dailyCalories': 'daily_calories',
        'wakeUpTime': 'wake_up_time',
        'sleepTime': 'sleep_time',
        'mealsPerDay': 'meals_per_day',
        'breakfastTime': 'breakfast_time',
        'lunchTime': 'lunch_time',
        'dinnerTime': 'dinner_time',
        'workLocation': 'work_location',
        'cookingTime': 'cooking_time',
        'exerciseRegularly': 'exercise_regularly',
        'exerciseType': 'exercise_type',
        'exerciseFrequency': 'exercise_frequency',
        'exerciseTime': 'exercise_time',
        'exerciseDuration': 'exercise_duration',
        'favoriteFood': 'favorite_food',
        'favoriteFoods': 'favorite_foods',
        'sweetOrSalty': 'sweet_or_salty',
        'likeCooking': 'like_cooking',
        'mealComplexity': 'meal_complexity',
        'allergies': 'allergies',
        'intolerances': 'intolerances',
        'dislikedFoods': 'disliked_foods',
        'specialDiet': 'special_diet',
        'healthConditions': 'health_conditions',
        'currentBreakfast': 'current_breakfast',
        'currentLunch': 'current_lunch',
        'currentDinner': 'current_dinner',
        'snacks': 'snacks',
        'waterIntake': 'water_intake',
        'alcohol': 'alcohol',
        'sweets': 'sweets',
        'stressLevel': 'stress_level',
        'sleepQuality': 'sleep_quality',
        'workHours': 'work_hours',
        'hasChildren': 'has_children',
        'livingArrangement': 'living_arrangement',
        'foodBudget': 'food_budget',
        'notificationTime': 'notification_time',
        'mealReminders': 'meal_reminders',
        'language': 'language'
    }

