// Rotta root: utile per testare se il backend è 

// Middleware per rotte inesistenti

export const notFound = (req, res, next) => {
  console.warn(`🚫 Rotta non trovata: ${req.method} ${req.originalUrl}`);
  res.status(404).json({ error: 'Route not found' });
};
