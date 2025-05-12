// Entry point dell'app Express

import express from 'express';
import cors from 'cors';

import moviesRouter from './routes/moviesRouter.js';
import { notFound } from './middlewares/notFound.js';
import { errorHandler } from './middlewares/errorHandler.js';

const app = express();
const port = 4000; // ✅ Porta fissa per il server backend

// ✅ Configurazione CORS: consente solo al frontend React su porta 5173 di accedere alle API
app.use(cors({
  origin: 'http://localhost:5173',   // 🔐 Solo questo dominio può accedere
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Facoltativo: limiti ai metodi
  credentials: false                 // Cambia a true solo se usi cookie o sessioni
}));

// ✅ Middleware globali
app.use(express.json()); // Permette parsing di JSON nel corpo delle richieste
app.use('/images', express.static('public/images')); // Serve immagini statiche

// ✅ Rotta per la homepage ("/") del backend
app.get('/', (req, res) => {
  res.send(`
    <h1>🎬 Benvenuto nella Movie API</h1>`);
});

// ✅ Rotte API
app.use('/movies', moviesRouter);

// ✅ Middleware per gestire rotte non esistenti
app.use(notFound);

// ✅ Middleware per errori generici
app.use(errorHandler);

// ✅ Avvio del server sulla porta 4000
app.listen(port, () => {
  console.log(`🚀 Server attivo su http://localhost:${port}`);
});
