# Conception et architecture d’une bibliothèque numérique décentralisée - Journal 

# Session 2 : 22 Septembre 2025
* Rédaction du glossaire technique 
* Test de l'API Gemini pour passer d'un PDF de livre scanné à un texte Markdown
* Test des différentes solutions d'OCR potentielles pour le projet (problèmes liés à l'installation sur machine)

# Session 3 : 29 Septembre 2025
* Continuation du glossaire technique
* Avancement sur la conversion d'un livre PDF en Markdown

# Session 4 : 6 Octobre 2025
* Finalisation des scénarios et des glossaires techniques et métier.
* Découverte des IA en local

# Session 5 : 13 Octobre 2025
* Ajout d'une partie qui vérifie le contenu des fichiers envoyés (contenu potentiellement inapproprié, propmpt IA dans le texte ...)
Si le texte contient du contenu problématique, on affiche un encadré qui détaille 
pourquoi il l'est

# Session 6 : 20 Octobre 2025
* Discussion autour du partage des œuvres protégèes 
Définition des besoins techniques/legaux, chiffrement + coupage

On a commencé par une solution full-chiffrement : 
Dès que l'IA a fini d'analyser le pdf, le fichier va soit : 
* Dans un dossier OK (Livre libre de droit)
* Dans un dossier NOK (Livre demandant une vérification manuelle)

Dans le dossier NOK, pour confirmer que le fichier envoyé est bon, 
Il faut l'autorisation de 3 membres du comité d'administration de la bibliothèque
afin de passer le fichier dans le dossier OK.
Il y a possibilité de le passer dans un autre dossier **Bientôt Libre de Droit**
qui sera chiffré également.

On a fini par penser que c'était peut-être un peu overkill, et que 
juste le dossier NOK et Bientôt Libre de Droit doivent être chiffrés.

La structure du dossier chiffré sera un dossier qui contiendra le livre,
lui-même contiendra plusieurs sous-dossiers chiffrés. Le livre est donc
découpé en plusieurs sous-fichiers.

On a aussi bossé sur le front !!! (UX Design)

# Session 7 : 3 Novembre 2025
Discussion sur ce qu'on a dit plus haut !

Refactorisation du code, en essayant d'avoir l'architecture la plus clean possible.

# Session 8 : 10 Novembre 2025
Discussion sur le modèle de données de Document, et User.
Un utilisateur contient : 
* Un nom d'utilisateur
* un Email
* un Hash de mot de passe (avec un sel pour éviter les collisions)
* Un rôle (Un enum : utilisateur ou administrateur)

Une réponse d'appel API contiendra les champs `success` (bool), `message`(string) et `data`,
qui contiendra :

## Groupe : metadata
| Champ           | Type      | Description                      |
|-----------------|-----------|----------------------------------|
| title           | string    | Titre du document                |
| author          | string    | Auteur                           |
| parution_date   | string    | Date de parution                 |
| is_appropriate  | boolean   | Contenu approprié ou non         |
| is_harmful      | boolean   | Contenu nuisible ou non          |
| is_compliant    | boolean   | Conforme aux règles              |

## Groupe : uploader
| Champ        | Type      | Description                      |
|--------------|-----------|----------------------------------|
| username     | string    | Nom d'utilisateur ayant uploadé  |
| upload_date  | datetime  | Date d'upload                    |

## Groupe : moderation
| Champ                | Type      | Description                               |
|----------------------|-----------|-------------------------------------------|
| approval_status      | enum      | Statut de validation (OK, NOK)|
| approval_date        | datetime  | Date de validation                        |
| details              | string    | Détails de la modération                  |
| approved_by          | array     | Liste des admins validateurs              |

## Groupe : markdown
| Champ            | Type      | Description                      |
|------------------|-----------|----------------------------------|
| content          | text      | Contenu converti en Markdown     |

## Groupe : document
| Champ         | Type      | Description                      |
|--------------|-----------|----------------------------------|
| document_id  | string    | Identifiant unique du document   |
| preview      | string    | Aperçu du contenu                |
| cover_image  | base64    | Image de couverture encodée      |

## Groupe : analyses
| Champ              | Type      | Description                      |
|--------------------|-----------|----------------------------------|
| security_analysis  | objet     | Analyse sécurité IA              |
| content_analysis   | objet     | Analyse modération IA            |
| compliance_issues  | array     | Problèmes de conformité détectés |


# Session 9 : 17 Novembre 2025
Présentation des modèles de conception aux autres !

# Session 10 : 01 Décembre 2025
Beaucoup de choses : intégration de la base "quarantaine", ajout 
des pages de modération, refactoring du front/back.

La base de quarantaine contiendra les livres en attente de validation, détectées par l'AI qu'elles
sont potentiellement problématiques.

Les admins peuvent voir la liste des livres en quarantaine, et décider de
valider ou non leur contenu.

# Session 11 : 07 Décembre 2025
Création d'une page de "mise en place des 3 admins", finalisation
des pages pour les admins, réalisation des tests unitaires.
