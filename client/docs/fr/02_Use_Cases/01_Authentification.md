# UC-01 — Authentification

Objectif: Permettre à un utilisateur de s’authentifier pour accéder aux fonctions membres ou modération.

Acteurs: Visiteur, Membre, Modérateur

Pré-conditions:
- L’utilisateur dispose d’un compte ou d’un moyen d’authentification (email/mot de passe, SSO, etc.).

Scénario principal:
1. L’utilisateur ouvre la page d’authentification depuis le header ou lors d’une action protégée.
2. Il saisit ses identifiants et soumet le formulaire.
3. Le frontend appelle l’API d’authentification.
4. L’API retourne un jeton et le profil de l’utilisateur (rôle).
5. Le frontend stocke le jeton (mémoire/secure storage) et met à jour l’état utilisateur.
6. L’utilisateur est redirigé vers la page d’origine ou son espace.

Post-conditions:
- L’utilisateur est authentifié et voit les actions correspondant à son rôle.

Erreurs/Alternatives:
- Identifiants invalides → message d’erreur, possibilité de réessayer.
- Service indisponible → affichage d’un message et suggestion ultérieure.
