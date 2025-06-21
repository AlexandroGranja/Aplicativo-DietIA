from flask import Blueprint, request, jsonify
from flask_cors import cross_origin
from src.models.user import db, User
from src.notification_service import diet_scheduler, WebPushNotificationService
from datetime import datetime
import json

notification_bp = Blueprint('notification', __name__)

# Instância do serviço de notificações push
push_service = WebPushNotificationService()

@notification_bp.route('/schedule-email/<int:user_id>', methods=['POST'])
@cross_origin()
def schedule_email_notifications(user_id):
    """Endpoint para agendar notificações por email"""
    try:
        data = request.get_json()
        user = User.query.get_or_404(user_id)
        
        email = data.get('email')
        notification_time = data.get('notification_time', user.notification_time)
        
        if not email:
            return jsonify({'error': 'Email é obrigatório'}), 400
        
        if not notification_time:
            return jsonify({'error': 'Horário de notificação é obrigatório'}), 400
        
        # Adicionar ao agendador
        diet_scheduler.add_user_to_schedule(user_id, notification_time, email)
        
        return jsonify({
            'message': 'Notificações por email agendadas com sucesso!',
            'user_id': user_id,
            'email': email,
            'notification_time': notification_time
        }), 201
        
    except Exception as e:
        return jsonify({'error': f'Erro ao agendar notificações: {str(e)}'}), 500

@notification_bp.route('/unschedule-email/<int:user_id>', methods=['DELETE'])
@cross_origin()
def unschedule_email_notifications(user_id):
    """Endpoint para cancelar notificações por email"""
    try:
        user = User.query.get_or_404(user_id)
        
        # Remover do agendador
        diet_scheduler.remove_user_from_schedule(user_id)
        
        return jsonify({
            'message': 'Notificações por email canceladas com sucesso!',
            'user_id': user_id
        }), 200
        
    except Exception as e:
        return jsonify({'error': f'Erro ao cancelar notificações: {str(e)}'}), 500

@notification_bp.route('/send-test-email/<int:user_id>', methods=['POST'])
@cross_origin()
def send_test_email(user_id):
    """Endpoint para enviar email de teste"""
    try:
        data = request.get_json()
        user = User.query.get_or_404(user_id)
        
        email = data.get('email')
        if not email:
            return jsonify({'error': 'Email é obrigatório'}), 400
        
        # Enviar email de teste
        diet_scheduler.send_daily_diet(user_id, email)
        
        return jsonify({
            'message': 'Email de teste enviado!',
            'user_id': user_id,
            'email': email
        }), 200
        
    except Exception as e:
        return jsonify({'error': f'Erro ao enviar email de teste: {str(e)}'}), 500

@notification_bp.route('/subscribe-push/<int:user_id>', methods=['POST'])
@cross_origin()
def subscribe_push_notifications(user_id):
    """Endpoint para inscrever-se em notificações push"""
    try:
        data = request.get_json()
        user = User.query.get_or_404(user_id)
        
        subscription_data = data.get('subscription')
        if not subscription_data:
            return jsonify({'error': 'Dados de inscrição são obrigatórios'}), 400
        
        # Adicionar inscrição
        push_service.add_subscription(user_id, subscription_data)
        
        return jsonify({
            'message': 'Inscrição em notificações push realizada com sucesso!',
            'user_id': user_id
        }), 201
        
    except Exception as e:
        return jsonify({'error': f'Erro ao inscrever em notificações push: {str(e)}'}), 500

@notification_bp.route('/send-push/<int:user_id>', methods=['POST'])
@cross_origin()
def send_push_notification(user_id):
    """Endpoint para enviar notificação push"""
    try:
        data = request.get_json()
        user = User.query.get_or_404(user_id)
        
        title = data.get('title', 'DietIA - Nova Dieta')
        body = data.get('body', 'Sua dieta diária está pronta!')
        url = data.get('url', 'http://localhost:5173')
        
        # Enviar notificação push
        success = push_service.send_push_notification(user_id, title, body, url)
        
        if success:
            return jsonify({
                'message': 'Notificação push enviada com sucesso!',
                'user_id': user_id
            }), 200
        else:
            return jsonify({'error': 'Falha ao enviar notificação push'}), 400
        
    except Exception as e:
        return jsonify({'error': f'Erro ao enviar notificação push: {str(e)}'}), 500

@notification_bp.route('/scheduled-users', methods=['GET'])
@cross_origin()
def get_scheduled_users():
    """Endpoint para listar usuários agendados"""
    try:
        scheduled_users = diet_scheduler.scheduled_users
        
        return jsonify({
            'scheduled_users': scheduled_users,
            'total': len(scheduled_users)
        }), 200
        
    except Exception as e:
        return jsonify({'error': f'Erro ao buscar usuários agendados: {str(e)}'}), 500

@notification_bp.route('/notification-status/<int:user_id>', methods=['GET'])
@cross_origin()
def get_notification_status(user_id):
    """Endpoint para verificar status das notificações de um usuário"""
    try:
        user = User.query.get_or_404(user_id)
        
        # Verificar se está agendado para email
        email_scheduled = any(u["user_id"] == user_id for u in diet_scheduler.scheduled_users)
        
        # Verificar se tem inscrição push
        push_subscribed = any(s["user_id"] == user_id for s in push_service.subscriptions)
        
        return jsonify({
            'user_id': user_id,
            'email_scheduled': email_scheduled,
            'push_subscribed': push_subscribed,
            'notification_time': user.notification_time,
            'language': user.language
        }), 200
        
    except Exception as e:
        return jsonify({'error': f'Erro ao verificar status: {str(e)}'}), 500

