// Middleware per errori generici

export const errorHandler = (err, req, res, next) => {
  console.error('🔥 Errore non gestito:', err);
  res.status(500).json({ error: 'Internal server error' });
};
