ARCHITEXTURE

main
- adminController = 
    - displayUsers, displayUser = récupère le token depuis les cookies, vérifie le token, récupère le role depuis les cookies, envoi le role au service authz via les headers, si le accessGranted est true dans la réponse du serveur alors displayUsers depuis le service api-users, sinon "accès refusé"
- authController = 
    - displayLogin, displayRegister
    - login, register = envoi les données au serveur, récupère  token + user, créer des cookies token et connected_user
- homeController : 
    - displayHome 
- userController (en alternative au adminController) : 
    - displayUsers, displayUser

api-users
- app.get('/'), app.get('/:email') : trouver les utilisateur ou un utilisateur en fonction de la route
- app.post('/') : récupérer les infos du req.body, enregistrer le nouvel utilisateur et le retourner

authentication-service
- app.post('/login') et app.post('/register') : récupère les infos de req.body, hash le password ou le vérifie, crée un token

authorization-service 
- app.post('/') : récupère methode, path, allowedRole et role et renvoie accessGranted: true ou false

BUGS
- si je suis connectée en tant qu'user, je n'ai pas mon message d'erreur
- mon seeding n'a pas marché

TODO
- rendre l'onglet "utilisateurs" visible uniquement aux admis OK

- ajouter trajets sur la page d'accueil
- donner la possibilité à l'admin de modifier ou supprimer un utilisateur
- ajouter une page "profil" et afficher 
    - les avis en tant que driver
    - les avis en tant que passenger

AdminController > à supprimer
