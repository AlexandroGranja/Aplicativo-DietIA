from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
import json

db = SQLAlchemy()

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    
    # Informações Pessoais
    name = db.Column(db.String(100), nullable=False)
    age = db.Column(db.Integer, nullable=False)
    gender = db.Column(db.String(20), nullable=False)
    height = db.Column(db.Float, nullable=False)  # em cm
    current_weight = db.Column(db.Float, nullable=False)  # em kg
    target_weight = db.Column(db.Float, nullable=True)  # em kg
    
    # Objetivos
    main_goal = db.Column(db.String(50), nullable=False)
    timeframe = db.Column(db.String(50), nullable=True)
    previous_diet = db.Column(db.Text, nullable=True)
    daily_calories = db.Column(db.Integer, nullable=False)
    
    # Rotina
    wake_up_time = db.Column(db.String(10), nullable=False)
    sleep_time = db.Column(db.String(10), nullable=False)
    meals_per_day = db.Column(db.String(10), nullable=False)
    breakfast_time = db.Column(db.String(10), nullable=True)
    lunch_time = db.Column(db.String(10), nullable=True)
    dinner_time = db.Column(db.String(10), nullable=True)
    work_location = db.Column(db.String(20), nullable=True)
    cooking_time = db.Column(db.String(20), nullable=True)
    
    # Atividade Física
    exercise_regularly = db.Column(db.String(20), nullable=True)
    exercise_type = db.Column(db.Text, nullable=True)  # JSON array
    exercise_frequency = db.Column(db.String(20), nullable=True)
    exercise_time = db.Column(db.String(10), nullable=True)
    exercise_duration = db.Column(db.String(20), nullable=True)
    
    # Preferências
    favorite_food = db.Column(db.Text, nullable=True)  # JSON array
    favorite_foods = db.Column(db.Text, nullable=True)
    sweet_or_salty = db.Column(db.String(20), nullable=True)
    like_cooking = db.Column(db.String(20), nullable=True)
    meal_complexity = db.Column(db.String(20), nullable=True)
    
    # Restrições
    allergies = db.Column(db.Text, nullable=True)
    intolerances = db.Column(db.Text, nullable=True)  # JSON array
    disliked_foods = db.Column(db.Text, nullable=True)
    special_diet = db.Column(db.String(50), nullable=True)
    health_conditions = db.Column(db.Text, nullable=True)
    
    # Alimentação Atual
    current_breakfast = db.Column(db.Text, nullable=True)
    current_lunch = db.Column(db.Text, nullable=True)
    current_dinner = db.Column(db.Text, nullable=True)
    snacks = db.Column(db.Text, nullable=True)
    water_intake = db.Column(db.String(20), nullable=True)
    alcohol = db.Column(db.String(20), nullable=True)
    sweets = db.Column(db.String(20), nullable=True)
    
    # Estilo de Vida
    stress_level = db.Column(db.String(20), nullable=True)
    sleep_quality = db.Column(db.String(20), nullable=True)
    work_hours = db.Column(db.String(20), nullable=True)
    has_children = db.Column(db.String(10), nullable=True)
    living_arrangement = db.Column(db.String(20), nullable=True)
    food_budget = db.Column(db.String(20), nullable=True)
    
    # Configurações
    notification_time = db.Column(db.String(10), nullable=True)
    meal_reminders = db.Column(db.String(10), nullable=True)
    language = db.Column(db.String(10), default='pt')
    
    # Metadados
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    def to_dict(self):
        """Converte o objeto User para dicionário"""
        result = {}
        for column in self.__table__.columns:
            value = getattr(self, column.name)
            if column.name in ['exercise_type', 'favorite_food', 'intolerances'] and value:
                try:
                    result[column.name] = json.loads(value)
                except:
                    result[column.name] = value
            else:
                result[column.name] = value
        return result
    
    @staticmethod
    def from_dict(data):
        """Cria um objeto User a partir de um dicionário"""
        user = User()
        
        # Mapeamento dos campos do frontend para o banco
        field_mapping = {
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
        
        for frontend_field, db_field in field_mapping.items():
            if frontend_field in data:
                value = data[frontend_field]
                
                # Converter arrays para JSON string
                if db_field in ['exercise_type', 'favorite_food', 'intolerances'] and isinstance(value, list):
                    value = json.dumps(value)
                
                # Converter strings vazias para None
                if value == '':
                    value = None
                
                setattr(user, db_field, value)
        
        return user

class Diet(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    date = db.Column(db.Date, nullable=False)
    
    # Refeições em JSON
    breakfast = db.Column(db.Text, nullable=True)
    morning_snack = db.Column(db.Text, nullable=True)
    lunch = db.Column(db.Text, nullable=True)
    afternoon_snack = db.Column(db.Text, nullable=True)
    dinner = db.Column(db.Text, nullable=True)
    evening_snack = db.Column(db.Text, nullable=True)
    
    # Informações nutricionais
    total_calories = db.Column(db.Float, nullable=True)
    total_protein = db.Column(db.Float, nullable=True)
    total_carbs = db.Column(db.Float, nullable=True)
    total_fat = db.Column(db.Float, nullable=True)
    
    # Metadados
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    ai_prompt_used = db.Column(db.Text, nullable=True)  # Para debug/melhoria
    
    # Relacionamento
    user = db.relationship('User', backref=db.backref('diets', lazy=True))
    
    def to_dict(self):
        """Converte o objeto Diet para dicionário"""
        result = {}
        for column in self.__table__.columns:
            value = getattr(self, column.name)
            if isinstance(value, datetime):
                result[column.name] = value.isoformat()
            else:
                result[column.name] = value
        return result

