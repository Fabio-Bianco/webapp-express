// Connessione al database MySQL
// ⚠️ I parametri sono hardcoded per l'esercizio (senza dotenv)

import mysql from 'mysql2/promise';

// Crea una connessione al database
export const db = await mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'T3enatrena1!',         
  database: 'movies_web_app'
});
