import os
import sys

# DON'T CHANGE THIS !!!
sys.path.insert(0, os.path.dirname(os.path.dirname(__file__)))

from flask import Flask, send_from_directory
from flask_cors import CORS  # ✅ CORS importado
from src.models.user import db
from src.routes.user import user_bp
from src.routes.ai import ai_bp
from src.routes.notification import notification_bp
from src.notification_service import start_notification_system

# Inicializa a aplicação Flask
app = Flask(__name__, static_folder=os.path.join(os.path.dirname(__file__), 'static'))

# ✅ Ativa o CORS para permitir requisições do frontend (ex: React em localhost:5173)
CORS(app, origins=["http://localhost:5173"], supports_credentials=True)

app.config['SECRET_KEY'] = 'asdf#FGSgvasgf$5$WGT'

# Configura o banco de dados SQLite
app.config['SQLALCHEMY_DATABASE_URI'] = f"sqlite:///{os.path.join(os.path.dirname(__file__), 'database', 'app.db')}"
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db.init_app(app)

with app.app_context():
    db.create_all()

# Registra as rotas (blueprints)
app.register_blueprint(user_bp, url_prefix='/api')
app.register_blueprint(ai_bp, url_prefix='/api/ai')
app.register_blueprint(notification_bp, url_prefix='/api/notifications')

# Inicializa sistema de notificações
start_notification_system()

# Rota para servir arquivos estáticos (frontend)
@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve(path):
    static_folder_path = app.static_folder
    if static_folder_path is None:
        return "Static folder not configured", 404

    if path != "" and os.path.exists(os.path.join(static_folder_path, path)):
        return send_from_directory(static_folder_path, path)
    else:
        index_path = os.path.join(static_folder_path, 'index.html')
        if os.path.exists(index_path):
            return send_from_directory(static_folder_path, 'index.html')
        else:
            return "index.html not found", 404

# Inicia o servidor
if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
