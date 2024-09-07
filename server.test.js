// server.test.js
const request = require('supertest');
const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const bcrypt = require('bcryptjs');
const mysql = require('mysql');
require('dotenv').config();

const app = express();

// Mocking the database connection and query execution
const mockQuery = jest.fn();
const db = {
  query: mockQuery,
};

// Initialize server with mock DB
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

describe('API Endpoints', () => {
  it('should register a new user', async () => {
    mockQuery.mockImplementation((query, values, callback) => {
      callback(null, {});
    });

    const response = await request(app)
      .post('/api/register')
      .send({
        username: 'testuser',
        password: 'password123',
      });

    expect(response.statusCode).toBe(201);
    expect(response.body.message).toBe('User registered successfully');
  });

  it('should login a user', async () => {
    mockQuery.mockImplementation((query, values, callback) => {
      callback(null, [{ id: 1, username: 'testuser', password: 'hashedpassword' }]);
    });
    jest.spyOn(bcrypt, 'compare').mockImplementation((password, hash, cb) => cb(null, true));

    const response = await request(app)
      .post('/api/login')
      .send({
        username: 'testuser',
        password: 'password123',
      });

    expect(response.statusCode).toBe(200);
    expect(response.body.message).toBe('Login successful');
  });

  it('should add an expense', async () => {
    // Mock session
    app.use((req, res, next) => {
      req.session.userId = 1;
      next();
    });

    mockQuery.mockImplementation((query, values, callback) => {
      callback(null, {});
    });

    const response = await request(app)
      .post('/api/expenses/add')
      .send({
        amount: 100.00,
        date: '2024-08-11',
        category: 'Food',
      });

    expect(response.statusCode).toBe(201);
    expect(response.body.message).toBe('Expense added successfully');
  });

  it('should fetch expenses', async () => {
    // Mock session
    app.use((req, res, next) => {
      req.session.userId = 1;
      next();
    });

    mockQuery.mockImplementation((query, values, callback) => {
      callback(null, [{ id: 1, amount: 100.00, date: '2024-08-11', category: 'Food' }]);
    });

    const response = await request(app).get('/api/expenses');

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual([{ id: 1, amount: 100.00, date: '2024-08-11', category: 'Food' }]);
  });
});
