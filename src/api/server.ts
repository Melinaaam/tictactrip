/*
    Configure et démarre le serveur Express
*/

import express from 'express';
import router from './routes';

const app = express();

app.use(express.text({ type: 'text/plain' }));
app.use('/api', router);

app.get('/', (req, res) => {
    res.json({ message: 'Text Justification API is running' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

export default app;