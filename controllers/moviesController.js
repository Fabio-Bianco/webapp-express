// controllers/moviesController.js
import { db } from "../db/index.js";
import slugify from "slugify";

// 🎞️ GET /movies → tutti i film con voto medio
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

// 🎞️ GET /movies/:id → dettaglio film per ID
export const show = async (req, res, next) => {
  try {
    const movieId = req.params.id;

    const [movieResults] = await db.query(
      `SELECT * FROM movies WHERE id = ?`,
      [movieId]
    );

    if (movieResults.length === 0) {
      return res.status(404).json({ error: "Movie not found" });
    }

    const [reviewResults] = await db.query(
      `SELECT * FROM reviews WHERE movie_id = ?`,
      [movieId]
    );

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

// 🎞️ GET /movies/slug/:slug → dettaglio film per slug
export const showBySlug = async (req, res, next) => {
  try {
    const { slug } = req.params;

    const [movieResults] = await db.query(
      `SELECT * FROM movies WHERE slug = ?`,
      [slug]
    );

    if (movieResults.length === 0) {
      return res.status(404).json({ error: "Film non trovato" });
    }

    const [reviewResults] = await db.query(
      `SELECT * FROM reviews WHERE movie_id = ?`,
      [movieResults[0].id]
    );

    const movie = {
      ...movieResults[0],
      imagePath: `/images/movies/${movieResults[0].image}`,
      reviews: reviewResults,
    };

    res.json(movie);
  } catch (error) {
    console.error("Errore in showBySlug:", error);
    next(error);
  }
};

// 🌟 GET /movies/featured → film con voti alti
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

// 🆕 POST /movies → crea un nuovo film con slug
export const createMovie = async (req, res) => {
  const { title, director, genre, release_year, abstract } = req.body;
  const image = req.file?.filename;

  if (!title || !director || !genre || !release_year || !abstract || !image) {
    return res.status(400).json({ error: "Tutti i campi sono obbligatori." });
  }

  const slug = slugify(title, { lower: true, strict: true });

  try {
    const [result] = await db.query(
      `INSERT INTO movies (title, slug, director, genre, release_year, abstract, image)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [title, slug, director, genre, release_year, abstract, image]
    );

    res.status(201).json({
      message: "Film inserito con successo",
      movieId: result.insertId,
      slug,
    });
  } catch (error) {
    console.error("❌ Errore in createMovie:", error);
    res.status(500).json({ error: "Errore nel salvataggio del film." });
  }
};
