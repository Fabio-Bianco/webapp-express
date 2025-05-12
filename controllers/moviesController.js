// Controller per le operazioni legate ai film

import { db } from '../db/index.js';

// Ritorna la lista di tutti i film con la media delle recensioni
export const getAllMovies = async (req, res, next) => {
  try {
    console.log('📥 Richiesta GET /movies ricevuta');

    const [rows] = await db.query(`
  SELECT movies.*, AVG(reviews.vote) AS average_rating
  FROM movies
  LEFT JOIN reviews ON reviews.movie_id = movies.id
  GROUP BY movies.id
`);

    console.log('📦 Film trovati:', rows.length);
    res.json(rows);
  } catch (error) {
    console.error('❌ Errore nella query getAllMovies:', error);
    next(error);
  }
};

// Ritorna i dettagli di un singolo film e le sue recensioni
export const getMovieById = async (req, res, next) => {
  try {
    const movieId = req.params.id;
    console.log(`📥 Richiesta GET /movies/${movieId} ricevuta`);

    const [movieRows] = await db.query(
      'SELECT * FROM movies WHERE id = ?',
      [movieId]
    );

    if (movieRows.length === 0) {
      console.warn(`⚠️ Nessun film trovato con ID: ${movieId}`);
      return res.status(404).json({ error: 'Movie not found' });
    }

    const [reviewRows] = await db.query(
      'SELECT * FROM reviews WHERE movie_id = ?',
      [movieId]
    );

    console.log(`📦 Film ID ${movieId} trovato con ${reviewRows.length} recensioni`);
    res.json({ ...movieRows[0], reviews: reviewRows });
  } catch (error) {
    console.error('❌ Errore nella query getMovieById:', error);
    next(error);
  }
};
