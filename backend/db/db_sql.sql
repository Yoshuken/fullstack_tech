CREATE TABLE IF NOT EXISTS library (
  id INTEGER PRIMARY KEY,
  isbn TEXT,
  title TEXT NOT NULL,
  author TEXT NOT NULL,
  year INTEGER,
  completed BOOLEAN
);