// app qui lance le serveur
import express from 'express';
import bodyParser from 'body-parser';
import tokenAuth from './middleware/tokenAuth';
import quotaLimit from './middleware/quotaLimit';

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware pour parser le corps des requêtes en JSON
app.use(bodyParser.json());

// Middleware d'authentification par token
app.use(tokenAuth);

// Middleware de gestion du quota
app.use(quotaLimit);

// Démarrage du serveur
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

export default app;
