CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  nom TEXT,
  prenom TEXT,
  mdp TEXT,
  role TEXT
);

CREATE TABLE eleves (
  id SERIAL PRIMARY KEY,
  nom TEXT,
  prenom TEXT,
  annee INT,
  tuteur TEXT,
  classe TEXT,
  matricule TEXT UNIQUE,
  paye INT DEFAULT 0
);
