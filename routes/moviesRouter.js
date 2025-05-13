import express from "express";
import { getAllMovies, getMovieById } from "../controllers/moviesController.js";
import { db } from "../db/index.js";

const router = express.Router();

router.get("/", getAllMovies);
router.get("/:id", getMovieById);

// POST /movies/:id/reviews
router.post("/:id/reviews", async (req, res) => {
  const movieId = req.params.id;
  const { text, vote } = req.body;

  if (!text || typeof vote !== "number") {
    return res.status(400).json({ error: "Testo e voto sono obbligatori" });
  }

  try {
    const [result] = await db.query(
      "INSERT INTO reviews (movie_id, text, vote) VALUES (?, ?, ?)",
      [movieId, text, vote]
    );

    res.status(201).json({
      message: "Recensione inserita",
      reviewId: result.insertId,
    });
  } catch (err) {
    console.error("Errore recensione:", err);
    res.status(500).json({ error: "Errore durante l'inserimento" });
  }
});

export default router;
