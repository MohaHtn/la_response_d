# Guide de Sécurité - Gestion des Clés API

## ⚠️ IMPORTANT - Sécurité des Clés API

### 🚫 Ce qu'il NE FAUT JAMAIS faire :

1. ❌ **NE JAMAIS** committer les clés API dans Git
2. ❌ **NE JAMAIS** stocker les clés en dur dans le code
3. ❌ **NE JAMAIS** partager les fichiers `.env` ou `apikey.json`
4. ❌ **NE JAMAIS** exposer les clés dans les logs ou messages d'erreur

### ✅ Bonnes pratiques mises en place :

1. ✅ **Variables d'environnement** : Les clés sont stockées dans `.env`
2. ✅ **`.gitignore`** : Les fichiers sensibles sont exclus de Git
3. ✅ **Configuration centralisée** : `app_config.py` gère toutes les configs
4. ✅ **Validation** : Vérification que les clés sont présentes au démarrage

---

## 📋 Configuration en Développement

### 1. Créer le fichier `.env`

Copiez le fichier `.env.example` en `.env` :

```bash
cd server
cp .env.example .env
```

### 2. Remplir vos clés API

Éditez le fichier `.env` et ajoutez vos vraies clés :

```env
PIXTRAL_API_KEY=votre_cle_pixtral_ici
GEMINI_API_KEY=votre_cle_gemini_ici
JWT_SECRET_KEY=generez_une_cle_aleatoire_longue
```

### 3. Générer une clé JWT sécurisée

```bash
# Sur Linux/Mac
openssl rand -hex 32

# Sur Windows PowerShell
python -c "import secrets; print(secrets.token_hex(32))"
```

---

## 🚀 Déploiement en Production

### Option 1 : Variables d'environnement système

Sur votre serveur de production, définissez les variables :

```bash
export PIXTRAL_API_KEY="votre_cle"
export GEMINI_API_KEY="votre_cle"
export JWT_SECRET_KEY="votre_secret"
export ENVIRONMENT="production"
export DEBUG="False"
```

### Option 2 : Fichier .env (à sécuriser)

Si vous utilisez un fichier `.env` en production :

```bash
# Permissions strictes (lecture uniquement par le propriétaire)
chmod 600 .env
chown www-data:www-data .env  # Adaptez selon votre utilisateur
```

### Option 3 : Services de gestion de secrets (RECOMMANDÉ)

Pour une production sérieuse, utilisez :

- **AWS Secrets Manager** (AWS)
- **Azure Key Vault** (Azure)
- **Google Secret Manager** (GCP)
- **HashiCorp Vault** (On-premise)
- **Docker Secrets** (Docker Swarm)
- **Kubernetes Secrets** (Kubernetes)

#### Exemple avec Docker :

```dockerfile
# docker-compose.yml
services:
  api:
    environment:
      - PIXTRAL_API_KEY=${PIXTRAL_API_KEY}
      - GEMINI_API_KEY=${GEMINI_API_KEY}
      - JWT_SECRET_KEY=${JWT_SECRET_KEY}
```

#### Exemple avec Kubernetes :

```yaml
# secret.yaml
apiVersion: v1
kind: Secret
metadata:
  name: api-secrets
type: Opaque
stringData:
  PIXTRAL_API_KEY: "votre_cle"
  GEMINI_API_KEY: "votre_cle"
  JWT_SECRET_KEY: "votre_secret"
```

---

## 🔒 Rotation des Clés

### Bonnes pratiques :

1. **Rotation régulière** : Changez les clés tous les 3-6 mois
2. **En cas de fuite** : Révoquez et régénérez immédiatement
3. **Utilisez des clés différentes** par environnement :
   - Développement
   - Staging
   - Production

### Procédure de rotation :

```bash
# 1. Générer une nouvelle clé
NEW_KEY=$(python -c "import secrets; print(secrets.token_hex(32))")

# 2. Mettre à jour .env
echo "JWT_SECRET_KEY=$NEW_KEY" >> .env

# 3. Redémarrer l'application
systemctl restart votre-app
```

---

## 📊 Surveillance

### Logs à surveiller :

```python
# Dans votre application, loggez les tentatives d'accès
if not config.PIXTRAL_API_KEY:
    logger.error("Clé API manquante - Accès refusé")
```

### Alertes à configurer :

- ⚠️ Échecs d'authentification répétés
- ⚠️ Utilisation anormale de l'API
- ⚠️ Tentatives d'accès non autorisées

---

## 🧪 Tests

### Vérifier la configuration :

```bash
cd server/src
python -c "from app.infra.config import config; config.validate_config(); print('✓ Configuration valide')"
```

---

## 📞 En cas de fuite de clé

### Actions immédiates :

1. **Révoquer** la clé compromise sur la plateforme (Mistral, Google, etc.)
2. **Générer** une nouvelle clé
3. **Mettre à jour** les variables d'environnement
4. **Redémarrer** tous les services
5. **Analyser** les logs pour détecter une utilisation abusive
6. **Notifier** votre équipe de sécurité

### Contacts :

- **Mistral AI Support** : https://console.mistral.ai/
- **Google Cloud Support** : https://console.cloud.google.com/

---

## ✅ Checklist de sécurité

Avant chaque déploiement, vérifiez :

- [ ] Les fichiers `.env` et `apikey.json` sont dans `.gitignore`
- [ ] Aucune clé n'apparaît dans le code source
- [ ] Les variables d'environnement sont configurées sur le serveur
- [ ] Les permissions des fichiers sensibles sont restrictives (600)
- [ ] Un système de rotation des clés est en place
- [ ] Les logs ne contiennent pas de clés en clair
- [ ] Les alertes de sécurité sont configurées

---

## 📚 Ressources

- [OWASP API Security](https://owasp.org/www-project-api-security/)
- [12-Factor App - Config](https://12factor.net/config)
- [Python-dotenv Documentation](https://github.com/theskumar/python-dotenv)

