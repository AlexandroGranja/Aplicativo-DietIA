"""
Sistema de Notificações por Email
Implementação alternativa ao WhatsApp para manter gratuidade
"""

import smtplib
import schedule
import time
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from datetime import datetime, timedelta
import json
import requests
from typing import Dict, List

class EmailNotificationService:
    """Serviço de notificações por email"""
    
    def __init__(self, smtp_server="smtp.gmail.com", smtp_port=587):
        self.smtp_server = smtp_server
        self.smtp_port = smtp_port
        self.email_user = None
        self.email_password = None
    
    def configure_email(self, email_user: str, email_password: str):
        """Configura credenciais de email"""
        self.email_user = email_user
        self.email_password = email_password
    
    def send_diet_email(self, to_email: str, user_name: str, formatted_diet: str, language: str = "pt"):
        """Envia dieta por email"""
        try:
            # Criar mensagem
            msg = MIMEMultipart()
            msg['From'] = self.email_user
            msg['To'] = to_email
            
            if language == "pt":
                msg['Subject'] = f"🍽️ Sua Dieta Diária - {datetime.now().strftime('%d/%m/%Y')}"
                
                body = f"""
Olá {user_name}! 👋

Aqui está sua dieta personalizada para hoje:

{formatted_diet}

📱 Acesse nossa plataforma para mais funcionalidades:
http://localhost:5173

💡 Dicas importantes:
• Mantenha-se hidratado bebendo bastante água
• Respeite os horários das refeições
• Ajuste as porções conforme sua fome
• Em caso de dúvidas, consulte um nutricionista

Tenha um ótimo dia! 🌟

---
DietIA - Seu assistente nutricional personalizado
"""
            else:  # English
                msg['Subject'] = f"🍽️ Your Daily Diet - {datetime.now().strftime('%m/%d/%Y')}"
                
                body = f"""
Hello {user_name}! 👋

Here's your personalized diet for today:

{formatted_diet}

📱 Access our platform for more features:
http://localhost:5173

💡 Important tips:
• Stay hydrated by drinking plenty of water
• Respect meal times
• Adjust portions according to your hunger
• If in doubt, consult a nutritionist

Have a great day! 🌟

---
DietIA - Your personalized nutrition assistant
"""
            
            msg.attach(MIMEText(body, 'plain', 'utf-8'))
            
            # Enviar email
            server = smtplib.SMTP(self.smtp_server, self.smtp_port)
            server.starttls()
            server.login(self.email_user, self.email_password)
            text = msg.as_string()
            server.sendmail(self.email_user, to_email, text)
            server.quit()
            
            return True
            
        except Exception as e:
            print(f"Erro ao enviar email: {str(e)}")
            return False

class DietScheduler:
    """Agendador de dietas diárias"""
    
    def __init__(self, api_base_url="http://localhost:5000"):
        self.api_base_url = api_base_url
        self.email_service = EmailNotificationService()
        self.scheduled_users = []
    
    def add_user_to_schedule(self, user_id: int, notification_time: str, email: str):
        """Adiciona usuário ao agendamento"""
        user_schedule = {
            "user_id": user_id,
            "notification_time": notification_time,
            "email": email
        }
        
        # Remover agendamento anterior se existir
        self.scheduled_users = [u for u in self.scheduled_users if u["user_id"] != user_id]
        
        # Adicionar novo agendamento
        self.scheduled_users.append(user_schedule)
        
        # Agendar tarefa
        schedule.every().day.at(notification_time).do(
            self.send_daily_diet, user_id, email
        ).tag(f"user_{user_id}")
        
        print(f"Usuário {user_id} agendado para receber dieta às {notification_time}")
    
    def send_daily_diet(self, user_id: int, email: str):
        """Envia dieta diária para um usuário"""
        try:
            # Gerar nova dieta
            response = requests.post(f"{self.api_base_url}/api/ai/generate-diet/{user_id}")
            
            if response.status_code == 201:
                diet_data = response.json()
                formatted_diet = diet_data.get("formatted_diet", "")
                
                # Buscar dados do usuário
                user_response = requests.get(f"{self.api_base_url}/api/user/{user_id}")
                if user_response.status_code == 200:
                    user_data = user_response.json()
                    user_name = user_data.get("name", "Usuário")
                    language = user_data.get("language", "pt")
                    
                    # Enviar por email
                    success = self.email_service.send_diet_email(
                        email, user_name, formatted_diet, language
                    )
                    
                    if success:
                        print(f"Dieta enviada com sucesso para {email}")
                    else:
                        print(f"Erro ao enviar email para {email}")
                else:
                    print(f"Erro ao buscar dados do usuário {user_id}")
            else:
                print(f"Erro ao gerar dieta para usuário {user_id}: {response.status_code}")
                
        except Exception as e:
            print(f"Erro ao enviar dieta diária: {str(e)}")
    
    def remove_user_from_schedule(self, user_id: int):
        """Remove usuário do agendamento"""
        self.scheduled_users = [u for u in self.scheduled_users if u["user_id"] != user_id]
        schedule.clear(f"user_{user_id}")
        print(f"Usuário {user_id} removido do agendamento")
    
    def start_scheduler(self):
        """Inicia o agendador"""
        print("Agendador de dietas iniciado...")
        while True:
            schedule.run_pending()
            time.sleep(60)  # Verificar a cada minuto

class WebPushNotificationService:
    """Serviço de notificações web push (alternativa ao email)"""
    
    def __init__(self):
        self.subscriptions = []
    
    def add_subscription(self, user_id: int, subscription_data: Dict):
        """Adiciona inscrição para notificações push"""
        subscription = {
            "user_id": user_id,
            "subscription": subscription_data,
            "created_at": datetime.now()
        }
        
        # Remover inscrição anterior se existir
        self.subscriptions = [s for s in self.subscriptions if s["user_id"] != user_id]
        
        # Adicionar nova inscrição
        self.subscriptions.append(subscription)
        
        print(f"Inscrição push adicionada para usuário {user_id}")
    
    def send_push_notification(self, user_id: int, title: str, body: str, url: str = None):
        """Envia notificação push para um usuário"""
        # Implementação simplificada - em produção usaria bibliotecas como pywebpush
        subscription = next((s for s in self.subscriptions if s["user_id"] == user_id), None)
        
        if subscription:
            notification_data = {
                "title": title,
                "body": body,
                "url": url or "http://localhost:5173",
                "timestamp": datetime.now().isoformat()
            }
            
            print(f"Notificação push enviada para usuário {user_id}: {title}")
            return True
        else:
            print(f"Nenhuma inscrição encontrada para usuário {user_id}")
            return False

# Instância global do agendador
diet_scheduler = DietScheduler()

def start_notification_system():
    """Inicia o sistema de notificações"""
    print("Sistema de notificações iniciado!")
    
    # Configurar email (em produção, usar variáveis de ambiente)
    # diet_scheduler.email_service.configure_email("seu_email@gmail.com", "sua_senha")
    
    # Iniciar agendador em thread separada
    import threading
    scheduler_thread = threading.Thread(target=diet_scheduler.start_scheduler, daemon=True)
    scheduler_thread.start()
    
    return diet_scheduler

if __name__ == "__main__":
    # Teste do sistema
    scheduler = start_notification_system()
    
    # Exemplo de uso
    # scheduler.add_user_to_schedule(1, "08:00", "usuario@email.com")
    
    print("Sistema de notificações em execução...")
    try:
        while True:
            time.sleep(1)
    except KeyboardInterrupt:
        print("Sistema de notificações parado.")

