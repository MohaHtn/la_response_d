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