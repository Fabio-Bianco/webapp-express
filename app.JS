import express from 'express';
import cors from 'cors';
import moviesRouter from './routes/moviesRouter.js';
import { notFound } from './middlewares/notFound.js';
import { errorHandler } from './middlewares/errorHandler.js';
import { db } from './db/index.js';

const app = express();
const port = 4000;

app.use(cors({ origin: true }));
app.use(express.json());
app.use('/images', express.static('public/images'));

app.get('/', (req, res) => {
  res.send('🎬 API attiva');
});

app.use('/movies', moviesRouter);
app.use(notFound);
app.use(errorHandler);

const startServer = async () => {
  try {
    await db.query('SELECT 1');
    console.log('✅ Connessione DB riuscita');
    app.listen(port, () => {
      console.log(`🚀 Server attivo su http://localhost:${port}`);
    });
  } catch (err) {
    console.error('❌ Errore connessione DB:', err.message);
    process.exit(1);
  }
};

startServer();
