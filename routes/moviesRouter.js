// routes/moviesRouter.js
import express from "express";
import {
  index,
  show,
  featured,
  createMovie,
  showBySlug,
} from "../controllers/moviesController.js";
import upload from "../middlewares/upload.js";
import { db } from "../db/index.js";

const router = express.Router();

// ✅ Film in evidenza
router.get("/featured", featured);

// ✅ Film per slug (SEO-friendly)
router.get("/slug/:slug", showBySlug);

// ✅ Lista completa dei film
router.get("/", index);

// ✅ Dettaglio singolo film con recensioni
router.get("/:id", show);

// ✅ Inserimento di un nuovo film (con immagine)
router.post("/", upload.single("image"), createMovie);

// ✅ Aggiunta recensione per un film
router.post("/:id/reviews", async (req, res) => {
  const movieId = req.params.id;
  const { name, vote, text } = req.body;

  if (!name || typeof vote !== "number" || vote < 1 || vote > 5) {
    return res.status(400).json({ error: "Dati recensione non validi" });
  }

  try {
    const [check] = await db.query(`SELECT id FROM movies WHERE id = ?`, [movieId]);

    if (check.length === 0) {
      return res.status(404).json({ error: "Film non trovato" });
    }

    const [result] = await db.query(
      `INSERT INTO reviews (movie_id, name, vote, text)
       VALUES (?, ?, ?, ?)`,
      [movieId, name, vote, text || null]
    );

    res.status(201).json({
      message: "Recensione salvata con successo",
      reviewId: result.insertId,
    });
  } catch (error) {
    console.error("❌ Errore inserimento recensione:", error);
    res.status(500).json({ error: "Errore interno del server" });
  }
});

export default router;
