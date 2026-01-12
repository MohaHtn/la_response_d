# Diagramme de Classes - Bibliotheko

## Diagramme de Classes

```mermaid
classDiagram
    %% ==================== Modèles de Données ====================
    
    class UserCredentials {
        +string username
        +string password
        +EmailStr email
    }
    
    class LoginCredentials {
        +string username
        +string password
    }
    
    class DocumentMetadata {
        +string title
        +string author
        +string parution_date
        +bool is_appropriate
        +bool is_harmful
        +bool is_compliant
    }
    
    class DocumentUploader {
        +string username
        +string upload_date
    }
    
    class ApprovalProcess {
        +BookStatus status
        +string date
        +string details
    }
    
    class DocumentModeration {
        +ApprovalProcess approval_process
        +list approved_by
    }
    
    class DocumentMarkdown {
        +string content
    }
    
    class Document {
        +DocumentMetadata metadata
        +DocumentUploader uploader
        +DocumentModeration moderation
        +DocumentMarkdown markdown
        +string document_id
        +string preview
        +string cover_image
    }
    
    class BookStatus {
        <<enumeration>>
        WAITING
        IN_APPROVAL
        IN_QUARANTINE
        OK
        NOK
    }
    
    %% ==================== API Layer ====================
    
    class FastAPIApp {
        -string title
        -list routers
        +health() dict
    }
    
    class Routers {
        +auth_router
        +documents_router
        +moderation_router
        +setup_router
        +admin_router
        +legacy_router
    }
    
    %% ==================== Services ====================
    
    class DocumentProcessingService {
        +normalize_metadata()
        +determine_compliance()
        +create_document_model()
        +enrich_document_data()
        +prepare_response_metadata()
        +build_success_response()
    }
    
    class AuthService {
        +hash_password()
        +verify_password()
        +encrypt_auth_data()
        +decrypt_auth_data()
    }
    
    class FileValidationService {
        +validate_file_type()
        +validate_file_size()
        +validate_and_read_file()
    }
    
    %% ==================== Infrastructure ====================
    
    class PixtralService {
        -string MODEL
        -string OCR_MODEL
        +process_pdf()
        +get_client()
    }
    
    class CryptoManager {
        -string key_file
        +encrypt(bytes) bytes
        +decrypt(bytes) bytes
    }
    
    class RedisManager {
        +get_client() Redis
    }
    
    %% ==================== Storage ====================
    
    class UserRepository {
        -Redis redis_client
        +user_exists(string) bool
        +get_user_record(string) dict
        +add_user(dict)
    }
    
    class DocumentRepository {
        -Redis redis_client
        +get_document(string) dict
        +add_document(dict) string
        +add_document_to_quarantine(dict) string
        +move_from_quarantine_to_approved(string) bool
    }
    
    %% ==================== Relations ====================
    
    FastAPIApp *-- Routers
    
    DocumentProcessingService ..> Document : creates
    AuthService ..> CryptoManager : uses
    DocumentProcessingService ..> PixtralService : uses
    
    UserRepository --> RedisManager : uses
    DocumentRepository --> RedisManager : uses
    
    AuthService ..> UserRepository : uses
    DocumentProcessingService ..> DocumentRepository : uses
    
    Document *-- DocumentMetadata
    Document *-- DocumentUploader
    Document *-- DocumentModeration
    DocumentModeration *-- ApprovalProcess
    ApprovalProcess o-- BookStatus
```

## Description des composants

### 1. Couche API (API Layer)

#### FastAPIApp
Application principale FastAPI ("Bibliotheko API") qui gère la configuration globale et l'agrégation des routeurs.

#### Routers
L'API est découpée en modules :
- **auth_router** : Inscription et connexion.
- **documents_router** : Gestion des documents approuvés.
- **moderation_router** : Flux de modération et quarantaine.
- **setup_router** : Configuration initiale.
- **admin_router** : Administration des utilisateurs.
- **legacy_router** : Endpoint historique `/api/send-book`.

### 2. Modèles de Données (Models)

Basés sur **Pydantic**, ils assurent la validation des données :
- **Document** : Modèle racine contenant les métadonnées, l'uploader, la modération et le contenu.
- **DocumentMetadata** : Informations descriptives et indicateurs de conformité.
- **BookStatus** : Énumération des états possibles d'un document (WAITING, OK, NOK, etc.).

### 3. Services de Domaine (Domain Services)

#### DocumentProcessingService
Gère la logique métier complexe liée aux documents :
- Normalisation des métadonnées issues de l'OCR.
- Détermination de la conformité basée sur les analyses de sécurité et de contenu.
- Construction des modèles et des réponses API.

#### AuthService
Gère la sécurité des comptes :
- Hachage PBKDF2-HMAC-SHA256.
- Chiffrement des données sensibles (hash + salt) avant stockage.

#### FileValidationService
Valide les fichiers PDF (type MIME, taille maximale).

### 4. Infrastructure

#### PixtralService
Interface avec l'API **Mistral AI** pour :
- L'OCR (Mistral OCR).
- L'analyse LLM (Pixtral) pour les métadonnées et la sécurité.

#### CryptoManager
Gère le chiffrement symétrique **Fernet** (AES-128) avec gestion automatique de la clé.

#### RedisManager
Gère la connexion au serveur **Redis**.

### 5. Couche de Stockage (Repositories)

Le stockage a été migré de fichiers JSON vers **Redis** pour plus de performance et de flexibilité :
- **UserRepository** : Stocke les profils utilisateurs sous forme de Hashes Redis.
- **DocumentRepository** : Stocke les documents (JSON sérialisé) et gère les index (Sets Redis) par statut et uploader. Gère également la zone de quarantaine séparée.

## Flux de données principaux

### 1. Inscription d'un utilisateur
`APIRouter` → `AuthService.hash_password` → `AuthService.encrypt_auth_data` → `UserRepository.add_user` → `Redis`.

### 2. Traitement d'un PDF
`APIRouter` → `FileValidationService` → `PixtralService.process_pdf` → `DocumentProcessingService.create_document_model` → `DocumentRepository`.

---

*Dernière mise à jour du diagramme : 2026-01-12*

