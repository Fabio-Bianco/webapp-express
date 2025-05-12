// Router per le rotte relative ai film

import express from 'express';
import {
  getAllMovies,
  getMovieById
} from '../controllers/moviesController.js';

const router = express.Router();

// GET /movies → tutti i film
router.get('/', getAllMovies);

// GET /movies/:id → dettaglio film + recensioni
router.get('/:id', getMovieById);

export default router;
