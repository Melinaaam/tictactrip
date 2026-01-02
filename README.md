Structure

Projet découpé en 4 parties :
- Logique de justification du texte 
- API/routes
- Contrôles d'accès
- Stockage de l'état 

========================
Logique de justification du texte 

- prendre texte brut en entrée
- découper en mots
- construire des lignes de 80 caractères max
- justifier les lignes (espaces entre les mots)
========================================================================

src/domain/justify
    tokenizer.ts  => découpage en mots
    justifyLine.ts  => prend une liste de mots pour une ligne et rend une ligne justifiée de 80 chars
    justifyText.ts  => prend le texte brut, utilise tokenizer et justifyLine pour rendre le texte justifié
TEST 
src/domain/tests/justify-tests
    tokenizer.test.ts
    justifyLine.test.ts
    justifyText.test.ts
========================

API/routes

- recuperer le texte brut via une requete POST
- renvoyer le texte justifié via la reponse
src/api
    routes.ts  => definit les routes de l'API
    server.ts  => demarre le serveur
TEST
src/tests/api-tests
    routes.test.ts
========================

Contrôles d'accès

- limiter l'accès à l'API via token
src/middleware
    tokenAuth.ts       // vérification du token
    quotaLimit.ts      // vérification du quota de mots
TEST
src/tests/middleware-tests
    tokenAuth.test.ts
    quotaLimit.test.ts
========================

Stockage de l'état  
 
- quel token existe  
- compter combien de mots ont été consomés par chaque token : limite de 80000 mots par token
src/storage
    tokenStore.ts      // Map<string, number> : token -> mots consommés
TEST
src/tests/storage-tests
    tokenStore.test.ts
========================

Etapes de réalisation

A- Coeur de la logique de justification du texte
1- tokenizer.ts : gérer espaces multiples, retours à la ligne
2- justifyLine.ts : prendre des mots d’une ligne + produire une ligne de 80 char 
3- justifyText.ts : assembler tout ça

B- Stockage et quota
1- tokenStore.ts : 
    createToken(email) (ou token random)
    exists(token)
    getWordUsed(token) / addWords(token, count)
    reset par jour 
2- quotaLimit.ts : 
    compter les mots recus
    verifier si used + newWords <= 80000

C- Authentification par token
1- tokenAuth.ts :
    lire le token dans les headers
    verifier si token existe
D- API et routes
1- routes.ts :
    POST /justify : lire le texte brut, appeler justifyText, renvoyer le texte justifié
2- server.ts : demarrer le serveur

D- Finalisation et tests
1- ecrire les tests unitaires pour chaque partie
2- tester l'API avec des requetes POST
========================