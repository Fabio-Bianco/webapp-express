// app.js
import express from 'express';
import cors from 'cors';
import moviesRouter from './routes/moviesRouter.js';
import { notFound } from './middlewares/notFound.js';
import { errorHandler } from './middlewares/errorHandler.js';
import { db } from './db/index.js';

const app = express();
const port = 4000;

// Abilitiamo CORS per tutti i client (React incluso)
app.use(cors({ origin: true }));

// Permette di leggere JSON nel body
app.use(express.json());

// Serve le immagini in /public/images via rotta /images
app.use('/images', express.static('public/images'));

// Test: root
app.get('/', (req, res) => {
  res.send('🎬 API attiva');
});

// Rotte film
app.use('/movies', moviesRouter);

// Middleware 404
app.use(notFound);

// Middleware gestione errori
app.use(errorHandler);

// Connessione al DB e avvio server
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
