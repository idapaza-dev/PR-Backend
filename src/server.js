
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import morgan from 'morgan';
import { connectDB } from './config/db.js';
import router from './routes/index.js';

dotenv.config();

const app = express();
app.use(express.json({ limit: '2mb' }));
app.use(cors({ origin: '*', credentials: false })); // en producción, pon tu dominio del frontend
app.use(morgan('dev'));

app.get('/', (_req, res) => res.send('KATZE API OK'));
app.use('/api', router);

// Handler simple de errores
app.use((err, _req, res, _next) => {
  console.error('[ERR]', err);
  res.status(500).json({ error: 'Error interno' });
});

const port = process.env.PORT || 3000;
connectDB(process.env.MONGO_URI).then(() => {
  app.listen(port, () => console.log(`http://localhost:${port}`));
});
