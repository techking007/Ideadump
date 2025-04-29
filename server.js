const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const bcrypt = require('bcryptjs');
const path = require('path');
const marked = require('marked');

const app = express();
const port = process.env.PORT || 3000;

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb+srv://srujal:srujal%40m0ng0db@srujal.aitn3br.mongodb.net/?retryWrites=true&w=majority&appName=Srujal', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('MongoDB connection error:', err));

// MongoDB Schema and Model (Assuming you have a User and Idea model)
const UserSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    // Add any other user fields
});
const User = mongoose.model('User', UserSchema);

const IdeaSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true },
    description: String,
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});
const Idea = mongoose.model('Idea', IdeaSchema);

// Middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(session({
    secret: 'ideadump', // Replace with a strong, unique secret
    resave: false,
    saveUninitialized: true,
    cookie: { secure: process.env.NODE_ENV === 'production' } // Set secure only in production
}));
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware to check if user is authenticated
const isAuthenticated = (req, res, next) => {
    if (req.session.userId) {
        return next();
    }
    res.redirect('/login');
};

// Routes

// GET routes for static pages
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/signup', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'signup.html'));
});

app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

app.get('/dashboard', isAuthenticated, async (req, res) => {
    try {
        const ideas = await Idea.find({ userId: req.session.userId }).sort({ createdAt: 'desc' });
        res.render('dashboard', {
            user: { username: req.session.username },
            ideas: ideas,
            marked: marked // Pass the marked function to the template
        });
    } catch (error) {
        console.error('Error fetching ideas:', error);
        res.status(500).send('Error fetching your ideas.');
    }
});
app.get('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            console.error('Error destroying session:', err);
            return res.status(500).send('Error logging out.');
        }
        res.redirect('/login');
    });
});

// API routes

// POST route for signup
app.post('/signup', async (req, res) => {
    try {
        const { username, email, password } = req.body;
        const existingUser = await User.findOne({ $or: [{ username }, { email }] });
        if (existingUser) {
            return res.status(400).json({ message: 'Username or email already exists.' });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ username, email, password: hashedPassword });
        await newUser.save();
        req.session.userId = newUser._id;
        req.session.username = newUser.username;
        res.status(201).json({ message: 'User registered successfully.' });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ message: 'Failed to register user.' });
    }
});

// POST route for login
app.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({ message: 'Invalid credentials.' });
        }
        req.session.userId = user._id;
        req.session.username = user.username; // Storing username in session
        res.status(200).json({ message: 'Logged in successfully.' });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Failed to login.' });
    }
});

// GET route to fetch user info (for displaying username on dashboard)
app.get('/api/user', isAuthenticated, (req, res) => {
    res.json({ username: req.session.username, userId: req.session.userId });
});

// GET route to fetch all ideas for the logged-in user
app.get('/api/ideas', isAuthenticated, async (req, res) => {
    try {
        const ideas = await Idea.find({ userId: req.session.userId }).sort({ createdAt: 'desc' });
        res.json(ideas);
    } catch (error) {
        console.error('Error fetching ideas:', error);
        res.status(500).json({ message: 'Failed to fetch ideas.' });
    }
});

// POST route to save a new idea
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

// DELETE route to delete an idea
app.delete('/api/ideas/:id', isAuthenticated, async (req, res) => {
    const ideaId = req.params.id;
    try {
        const idea = await Idea.findOneAndDelete({ _id: ideaId, userId: req.session.userId });
        if (!idea) {
            return res.status(404).json({ message: 'Idea not found or you are not authorized to delete it.' });
        }
        res.status(200).json({ message: 'Idea deleted successfully.' });
    } catch (error) {
        console.error('Error deleting idea:', error);
        res.status(500).json({ message: 'Failed to delete idea.' });
    }
});

// PUT route to update an existing idea
app.put('/api/ideas/:id', isAuthenticated, async (req, res) => {
    const ideaId = req.params.id;
    const { title, description } = req.body;
    try {
        const updatedIdea = await Idea.findOneAndUpdate(
            { _id: ideaId, userId: req.session.userId },
            { title, description, updatedAt: Date.now() },
            { new: true } // Return the updated document
        );
        if (!updatedIdea) {
            return res.status(404).json({ message: 'Idea not found or you are not authorized to update it.' });
        }
        res.status(200).json({ message: 'Idea updated successfully!', idea: updatedIdea });
    } catch (error) {
        console.error('Error updating idea:', error);
        res.status(500).json({ message: 'Failed to update idea.' });
    }
});

app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});