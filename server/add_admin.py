import redis
from werkzeug.security import generate_password_hash
import json

# Connexion à Redis
r = redis.Redis(host='localhost', port=6379, db=0, decode_responses=True)

# Données de l'admin
admin_username = 'admin'
admin_password = generate_password_hash('helo')

# Créer l'utilisateur admin
user_data = {
    'username': admin_username,
    'password': admin_password,
    'role': 'admin',
    'created_at': '2025-01-15T10:00:00'
}

# Stocker dans Redis
r.set(f'user:{admin_username}', json.dumps(user_data))

print(f"Admin {admin_username} créé avec succès")