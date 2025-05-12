// Entry point dell'app Express

import express from 'express';
import cors from 'cors';

import moviesRouter from './routes/moviesRouter.js';
import { notFound } from './middlewares/notFound.js';
import { errorHandler } from './middlewares/errorHandler.js';

const app = express();
const port = 4000; // ✅ Fissa la porta

// Middleware globali
app.use(cors());                              // ✅ Permette chiamate da React
app.use(express.json());                      // ✅ Supporto per JSON
app.use('/images', express.static('public/images')); // ✅ Static per immagini (bonus)

// API Routes
app.use('/movies', moviesRouter);

// Middleware finale: 404 e gestione errori
app.use(notFound);
app.use(errorHandler);

// Avvio server sulla porta 4000
app.listen(port, () => {
  console.log(`🚀 Server attivo su http://localhost:${port}`);
});
