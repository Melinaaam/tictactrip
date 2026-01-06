import express from 'express';
import bodyParser from 'body-parser';
import apiRoutes from './api/routes';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());

app.use('/api/justify', express.text({ type: 'text/plain' }));

app.use('/api', apiRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

export default app;
