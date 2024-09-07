const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const bcrypt = require('bcryptjs');
const mysql = require('mysql');
require('dotenv').config();

const app = express();

const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME
});

db.connect(err => {
  if (err) {
    console.error('Error connecting to MySQL:', err);
    return;
  }
  console.log('Connected to MySQL');
  
  // Create Users table if it doesn't exist
  const createUsersTable = `
    CREATE TABLE IF NOT EXISTS Users (
      id INT AUTO_INCREMENT PRIMARY KEY,
      username VARCHAR(255) UNIQUE NOT NULL,
      password VARCHAR(255) NOT NULL
    );
  `;
  
  db.query(createUsersTable, (err, result) => {
    if (err) {
      console.error('Error creating Users table:', err);
      return;
    }
    console.log('Users table created or already exists');
  });

  // Create Expenses table if it doesn't exist
  const createExpensesTable = `
    CREATE TABLE IF NOT EXISTS Expenses (
      id INT AUTO_INCREMENT PRIMARY KEY,
      user_id INT,
      amount DECIMAL(10, 2),
      date DATE,
      category VARCHAR(255),
      FOREIGN KEY (user_id) REFERENCES Users(id)
    );
  `;
  
  db.query(createExpensesTable, (err, result) => {
    if (err) {
      console.error('Error creating Expenses table:', err);
      return;
    }
    console.log('Expenses table created or already exists');
  });
});

app.use(bodyParser.json());
app.use(session({
  secret: 'your-secret-key',
  resave: false,
  saveUninitialized: true
}));

app.post('/api/register', (req, res) => {
  const { username, password } = req.body;
  bcrypt.hash(password, 10, (err, hashedPassword) => {
    if (err) return res.status(500).json({ error: err.message });
    const query = 'INSERT INTO Users (username, password) VALUES (?, ?)';
    db.query(query, [username, hashedPassword], (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      res.status(201).json({ message: 'User registered successfully' });
    });
  });
});

app.post('/api/login', (req, res) => {
  const { username, password } = req.body;
  const query = 'SELECT * FROM Users WHERE username = ?';
  db.query(query, [username], (err, results) => {
    if (err || results.length === 0) return res.status(401).json({ error: 'Invalid credentials' });
    const user = results[0];
    bcrypt.compare(password, user.password, (err, isMatch) => {
      if (err || !isMatch) return res.status(401).json({ error: 'Invalid credentials' });
      req.session.userId = user.id;
      res.status(200).json({ message: 'Login successful' });
    });
  });
});

app.post('/api/expenses/add', (req, res) => {
  const { amount, date, category } = req.body;
  const userId = req.session.userId;
  const query = 'INSERT INTO Expenses (user_id, amount, date, category) VALUES (?, ?, ?, ?)';
  db.query(query, [userId, amount, date, category], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(201).json({ message: 'Expense added successfully' });
  });
});

app.get('/api/expenses', (req, res) => {
  const userId = req.session.userId;
  const query = 'SELECT * FROM Expenses WHERE user_id = ?';
  db.query(query, [userId], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(200).json(results);
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
