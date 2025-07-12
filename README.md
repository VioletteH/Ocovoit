### OCOVOIT

## Demande client

**Ocovoit** est une plateforme de covoiturage qui permet de mettre en relation des conducteurs et des passagers pour des trajets courts ou longs.

# Contraintes

* Scalabilité (bcp d'utilisateurs / plusieurs serveurs)
* Volumétrie importante des données
* Réception des données en temps réel
* Application maintenable et évolutive
* Gestion des droits des utilisateurs (plusieurs types d'accès)
* API documentée
* Envoi de notifications
* Conteneurisation
* TypeScript

# Fonctionnalités

* Inscription et connexion
* Création et modification de trajets
* Recherche de trajets
* Gestion des réservations
* Gestion des avis

# Accès et roles
* un utilisateur peut combiner des rôles de conducteur et passager
* un utilisateur a des droits "classiques" ou admin, ce qui donne accès à la liste des utilisateurs

## CONCEPTION

Les éléments attendus : 
- Analyse du besoin : user stories ou use cases
- Modélisation : MCD, MLD ou ERD
- Choix justifié de l'architecture et des technos
- Plan de test

## REALISATION

# Fonctionalités réalisées
En tant qu'utilisateur, je veux
- m'inscrire afin de créer un compte (C) 
- me connecter / me déconnecter afin de gérer l'accès à mon compte 
- afficher les trajets afin de pouvoir planifier un trajet (R) 
- accéder à mon profil et celui des autres utilisateurs afin de consulter les trajets proposés et les avis (R) // TODO

En tant qu'admin,je veux 
- accéder à une page regroupant tous les profils utilisateurs afin de pouvoir modifier leurs droits ou supprimer leur profil(R) // réalisé en partie
- modifier les droits d'un utilisateur afin de lui donner ou lui enlever des droits admin (U) // TODO
- supprimer un profil utilisateur afin de modérer la plateforme (D) // TODO

# Architecture détaillée

Microservices : 

main 
controllers
- authController = 
    - displayLogin, displayRegister
    - login, register, logout = envoi les données au serveur, récupère  token + user, créer des cookies token et connected_user
- homeController : 
    - displayHome
- userController : 
    - displayUsers 
middlewares 
- routeAuthz : 
    - routeAuthz : récupère le token depuis les cookies, vérifie le token, récupère le role depuis les cookies, envoi le role au service authz via les headers, si le accessGranted est true dans la réponse du serveur alors displayUsers depuis le service api-users, sinon "accès refusé"

api-users
- get('/'), get('/:email') : trouver les utilisateur ou un utilisateur en fonction de la route
- post('/') : récupérer les infos du req.body, enregistrer le nouvel utilisateur et le retourner

api-trips
- get('/') : trouver les trajets et les retourner

api-stages
- get('/'), get('/:id') : trouver les étapes ou une étape en focntion de la route et les retourner

authentication-service
- post('/login'), post('/register') : récupère les infos de req.body, hash le password ou le vérifie, crée un token

authorization-service 
- post('/') : récupère methode, path de req.body et role des headers et renvoie accessGranted: true ou false

# Les étapes

Base de données
- création d'un fichier de seeding pour mongodb

Création des microservices API 
- création du package.json et installation des dépendances
- création du fichier tsconfig.json
- création du Dockerfile et du .dockerignore
- connection à la BDD
- création des models
- création des fonctions get('/'), get('/:id') pour récupérer les données de la BDD et les renvoyer
- création des fonctions post('/') pour créer une nouvelle entrée

Création du microservice authentication 
- idem 3 premières étapes microservices 
- création des fonctions post('/login') et post('/register') pour envoyer les infos de req.body au serveur, hasher le password ou le vérifier et retourner un token

Création du microservice authorization 
- idem 3 premières étapes microservices 
- création d'un fichier ACL pour définir les accès aux routes en fonction des rôles
- création de la fonction post('/') pour récupérer methode, path de req.body et role de headers, comparer avec les routes ACL et retourner accessGranted: true ou false

Création du microservice main
- idem 3 premières étapes microservices 
- création du fichier index et des locals auth-token et role_admin
- création du router
- création des controllers : 
  - authController : fonctions pour afficher les formulaires de connection et inscription et fonctions pour envoyer les données au serveur, récupérer un token et l'inscrire dans les cookies
  - homeController pour afficher les trajets
  - userController pour afficher les utilisateurs
- création d'un middleware : 
  - routeAuthz pour récupérer le token, le vérifier, récupérer le role depuis les cookies et 
   l'envoyer au serveur via les headers puis renvoyer un boolean en fonction de l'accès accordé
- création des vues home, users, login, register
- création du fichier de style

Connection des différents conteneurs via un docker compose
Création des variables d'environnement nécessaires
Création de tests fonctionnels avec Jest sur le service d'authentification

TODO
- faire les tests (check fichier + compléter)
- check hash de mdp dans la BDD > hashé uniquement pour les nouveaux > est ce que je met un format hashé dans la BDD?
