// configurazione di express
const express = require('express');
const app = express();
const port = 4000;

// route principale
// middleware per il parsing del body delle richieste
app.get('/', (req, res) => {
  res.send('Benvenuto nella nostra Webb Application');
});


// server in ascolto sulla porta 3000
app.listen(port, () => {
  console.log(`WebApp listening at ${port}`);
});
