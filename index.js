require('dotenv').config();
const express = require('express');
const { Pool } = require('pg');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const port = process.env.PORT || 10000;

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

// Créer les tables si elles n'existent pas
const initDB = async () => {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      nom TEXT,
      prenom TEXT,
      mdp TEXT,
      role TEXT
    );
  `);
  await pool.query(`
    CREATE TABLE IF NOT EXISTS eleves (
      id SERIAL PRIMARY KEY,
      nom TEXT,
      prenom TEXT,
      annee INT,
      tuteur TEXT,
      classe TEXT,
      matricule TEXT UNIQUE,
      paye INT DEFAULT 0
    );
  `);
};

// Routes
app.post('/api/register', async (req, res) => {
  const { nom, prenom, mdp, role } = req.body;
  await pool.query('INSERT INTO users (nom, prenom, mdp, role) VALUES ($1, $2, $3, $4)', [nom, prenom, mdp, role]);
  res.send({ success: true });
});

app.post('/api/login', async (req, res) => {
  const { nom, mdp } = req.body;
  const result = await pool.query('SELECT * FROM users WHERE nom=$1 AND mdp=$2', [nom, mdp]);
  res.send(result.rows[0] || null);
});

app.post('/api/eleve', async (req, res) => {
  const { nom, prenom, annee, tuteur, classe } = req.body;
  const matricule = 'MB' + Math.random().toString(36).substr(2, 6).toUpperCase();
  await pool.query('INSERT INTO eleves (nom, prenom, annee, tuteur, classe, matricule) VALUES ($1, $2, $3, $4, $5, $6)', [nom, prenom, annee, tuteur, classe, matricule]);
  res.send({ matricule });
});

app.get('/api/eleves', async (req, res) => {
  const result = await pool.query('SELECT * FROM eleves ORDER BY classe');
  res.send(result.rows);
});

app.put('/api/paiement', async (req, res) => {
  const { matricule, montant } = req.body;
  await pool.query('UPDATE eleves SET paye = paye + $1 WHERE matricule = $2', [montant, matricule]);
  res.send({ success: true });
});

initDB().then(() => {
  app.listen(port, () => {
    console.log(`Serveur démarré sur le port ${port}`);
  });
});
