const express = require('express');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config();

//const uri = process.env.MONGODB_URI;

const app = express();
const secretKey = 'fjkfufru#urnfu8oiio';

app.use(express.json());

// Sample user data (Replace with your database or actual authentication logic)
const users = [];

// Endpoint for user registration
app.post('/register', (req, res) => {
    const { username, password } = req.body;

    // Check if user already exists
    const existingUser = users.find((user) => user.username === username);
    if(existingUser) {
        return res.status(400).json({ message: 'Username already exists'});
    }

    // Add new user to the database
    const newUser = {
        id: users.length + 1,
        username,
        password,
    };
    users.push(newUser);

    res.status(201).json({ message: 'User registered successfully'});
});

// Endpoint for user login
app.post('/login', (req, res) => {
    const { username, password } = req.body;

    // Find usr by usrname and password
    const user = users.find((user) => user.username === username && user.password === password);

    if(user) {
        // User authenticated, generate token
        const token = jwt.sign({ id: user.id, username: user.username }, secretKey);
        res.json({ token });
    } else {
        res.status(401).json({ message: 'Invalid credentials'});
    }
});

// Protected route example (Dashboard access)
app.get('/dashboard', verifyToken, (req, res) => {
    // Return dashboard data or user-specific information
    res.json({ message: 'Welcome to the Customer Portal!' });
});

// Middleware to verify JWT token
function verifyToken(req, res, next) {
    const token = req.headers['authorization'];

    if(typeof token !== 'undefined') {
        jwt.verify(token, secretKey, (err, authData) => {
            if(err) {
                res.sendStatus(403);
            } else {
                req.authData = authData;
                next();
            }
        });
    } else {
        res.sendStatus(401);
    }
}

// Start server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log('Server running on port ${PORT}');
});
