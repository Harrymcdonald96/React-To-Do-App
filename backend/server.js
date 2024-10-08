require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path'); // Added for serving static files
const Task = require('./models/task'); // Ensure this is at the top, after packages

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json()); // For parsing application/json

// Handle preflight requests for all routes
app.options('*', cors());

// MongoDB URI
const uri = process.env.MONGODB_URI;
mongoose.connect(uri);

const connection = mongoose.connection;
connection.once('open', () => {
  console.log("MongoDB database connection established successfully");
});

// Get all tasks
app.get('/api/tasks', (req, res) => {
  Task.find()
    .then(tasks => res.json(tasks))
    .catch(err => res.status(400).json('Error: ' + err));
});

// Add new task
app.post('/api/tasks', async (req, res) => {
  const newTask = new Task({ text: req.body.text, completed: false });
  try {
    const savedTask = await newTask.save();
    res.json(savedTask);
  } catch (err) {
    res.status(400).json('Error: ' + err);
  }
});

// Update a task
app.put('/api/tasks/:id', async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    task.completed = !task.completed;
    const updatedTask = await task.save();
    res.json(updatedTask);
  } catch (err) {
    res.status(400).json('Error: ' + err);
  }
});

// Delete a task
app.delete('/api/tasks/:id', async (req, res) => {
  try {
    await Task.findByIdAndDelete(req.params.id);
    res.json('Task deleted.');
  } catch (err) {
    res.status(400).json('Error: ' + err);
  }
});

// Serve static files from the React frontend
app.use(express.static(path.join(__dirname, 'build')));

// For any route that doesn't match an API route, serve the index.html file
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});
