import express from 'express';
import bodyParser from 'body-parser';
import apiRoutes from './api/routes';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.json({
    message: 'API de Justification de Texte - TictacTrip',
    endpoints: {
      'POST /api/token': 'Générer un token d\'authentification',
      'POST /api/justify': 'Justifier un texte à 80 caractères par ligne'
    },
    documentation: 'https://github.com/Melinaann/tictactrip'
  });
});

app.use('/api/justify', express.text({ type: 'text/plain' }));

app.use('/api', apiRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

export default app;
