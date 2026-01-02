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