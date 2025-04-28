const express = require('express');
const session = require('express-session');
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const path = require('path');

const app = express();
const port = 3000;

// MongoDB Connection
mongoose.connect("mongodb+srv://srujal:srujal%40m0ng0db@srujal.aitn3br.mongodb.net/?retryWrites=true&w=majority&appName=Srujal", { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => console.log('Connected to MongoDB'));

// Models (assuming you have these in /models)
const User = require('./models/user');
const Idea = require('./models/idea');

// Session Middleware
app.use(session({
    secret: 'your-secret-key', // Replace with a strong, random key
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // Set to true in production if using HTTPS
}));

// Middleware to parse request bodies
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Set up view engine for serving HTML files (no templating engine for simplicity)
app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'public', 'index.html')));
app.get('/login', (req, res) => res.sendFile(path.join(__dirname, 'views', 'login.html')));
app.get('/signup', (req, res) => res.sendFile(path.join(__dirname, 'views', 'signup.html')));

// Authentication Routes
app.post('/register', async (req, res) => {
    try {
        const { username, email, password } = req.body;
        const existingUser = await User.findOne({ $or: [{ username }, { email }] });
        if (existingUser) {
            return res.status(400).json({ message: 'Username or email already exists.' });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ username, email, password: hashedPassword });
        await newUser.save();
        res.status(201).json({ message: 'User registered successfully.' });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ message: 'Failed to register user.' });
    }
});

app.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({ message: 'Invalid credentials.' });
        }
        req.session.userId = user._id;
        res.status(200).json({ message: 'Logged in successfully.' });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Failed to login.' });
    }
});

app.get('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error('Logout error:', err);
            return res.status(500).json({ message: 'Failed to logout.' });
        }
        res.redirect('/');
    });
});

// Middleware to check if user is logged in
function isAuthenticated(req, res, next) {
    if (req.session.userId) {
        next();
    } else {
        res.status(401).json({ message: 'Unauthorized.' });
    }
}

// Idea Routes (Protected by isAuthenticated)
app.post('/api/ideas', isAuthenticated, async (req, res) => {
    try {
        const { title, description } = req.body;
        const newIdea = new Idea({ userId: req.session.userId, title, description });
        await newIdea.save();
        res.status(201).json({ message: 'Idea saved successfully!', idea: newIdea });
    } catch (error) {
        console.error('Error saving idea:', error);
        res.status(500).json({ message: 'Failed to save idea.' });
    }
});

app.get('/api/ideas', isAuthenticated, async (req, res) => {
    try {
        const ideas = await Idea.find({ userId: req.session.userId }).sort({ createdAt: -1 });
        res.status(200).json(ideas);
    } catch (error) {
        console.error('Error fetching ideas:', error);
        res.status(500).json({ message: 'Failed to fetch ideas.' });
    }
});

app.get('/dashboard', isAuthenticated, (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'dashboard.html'));
});

app.listen(port, () => console.log(`Server listening on port ${port}`));