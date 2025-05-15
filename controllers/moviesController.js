// controllers/moviesController.js
import { db } from "../db/index.js";

// 🎞️ GET /movies
export const index = async (req, res, next) => {
  try {
    const [movies] = await db.query(`
      SELECT movies.*, AVG(reviews.vote) AS average_vote
      FROM movies
      LEFT JOIN reviews ON reviews.movie_id = movies.id
      GROUP BY movies.id
      ORDER BY movies.release_year DESC
    `);

    const moviesWithImagePath = movies.map((movie) => ({
      ...movie,
      imagePath: `/images/movies/${movie.image}`,
    }));

    res.json(moviesWithImagePath);
  } catch (error) {
    console.error("Errore in index (GET /movies):", error);
    next(error);
  }
};

// 🎞️ GET /movies/:id
export const show = async (req, res, next) => {
  try {
    const movieId = req.params.id;

    const [movieResults] = await db.query(`SELECT * FROM movies WHERE id = ?`, [movieId]);

    if (movieResults.length === 0) {
      return res.status(404).json({ error: "Movie not found" });
    }

    const [reviewResults] = await db.query(`SELECT * FROM reviews WHERE movie_id = ?`, [movieId]);

    const movie = {
      ...movieResults[0],
      imagePath: `/images/movies/${movieResults[0].image}`,
      reviews: reviewResults,
    };

    res.json(movie);
  } catch (error) {
    console.error("Errore in show (GET /movies/:id):", error);
    next(error);
  }
};

// 🎞️ GET /movies/featured
export const featured = async (req, res, next) => {
  try {
    const [movies] = await db.query(`
      SELECT movies.*, AVG(reviews.vote) AS average_vote
      FROM movies
      LEFT JOIN reviews ON reviews.movie_id = movies.id
      GROUP BY movies.id
      ORDER BY average_vote DESC
      LIMIT 5
    `);

    const moviesWithImagePath = movies.map((movie) => ({
      ...movie,
      imagePath: `/images/movies/${movie.image}`,
    }));

    res.json(moviesWithImagePath);
  } catch (error) {
    console.error("Errore in featured:", error);
    next(error);
  }
};

// 🎞️ POST /movies
export const createMovie = async (req, res) => {
  const { title, director, genre, release_year, abstract } = req.body;
  const image = req.file?.filename;

  if (!title || !director || !genre || !release_year || !abstract || !image) {
    return res.status(400).json({ error: "Tutti i campi sono obbligatori." });
  }

  try {
    const [result] = await db.query(
      `INSERT INTO movies (title, director, genre, release_year, abstract, image)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [title, director, genre, release_year, abstract, image]
    );

    res.status(201).json({ message: "Film inserito con successo", movieId: result.insertId });
  } catch (error) {
    console.error("❌ Errore in createMovie:", error);
    res.status(500).json({ error: "Errore nel salvataggio del film." });
  }
};
