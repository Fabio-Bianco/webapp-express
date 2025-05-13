import { db } from "../db/index.js";

// GET /movies
export const getAllMovies = async (req, res, next) => {
  try {
    const [rows] = await db.query(`
      SELECT movies.*, AVG(reviews.vote) AS average_vote
      FROM movies
      LEFT JOIN reviews ON reviews.movie_id = movies.id
      GROUP BY movies.id
    `);

    const moviesWithImagePath = rows.map((movie) => ({
      ...movie,
      imagePath: "/images/movies/" + movie.image,
    }));

    res.json(moviesWithImagePath);
  } catch (error) {
    console.error("Errore getAllMovies:", error);
    next(error);
  }
};

// GET /movies/:id
export const getMovieById = async (req, res, next) => {
  try {
    const movieId = req.params.id;

    const [movieRows] = await db.query(
      "SELECT * FROM movies WHERE id = ?",
      [movieId]
    );

    if (movieRows.length === 0) {
      return res.status(404).json({ error: "Movie not found" });
    }

    const [reviewRows] = await db.query(
      "SELECT * FROM reviews WHERE movie_id = ?",
      [movieId]
    );

    const movie = {
      ...movieRows[0],
      imagePath: "/images/movies/" + movieRows[0].image,
      reviews: reviewRows,
    };

    res.json(movie);
  } catch (error) {
    console.error("Errore getMovieById:", error);
    next(error);
  }
};
