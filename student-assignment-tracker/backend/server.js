require('dotenv').config();
const dns = require('dns');
const express = require('express');
const cors = require('cors');
const { MongoClient, ObjectId } = require('mongodb');

// Fix Windows DNS resolution for MongoDB Atlas SRV records
dns.setServers(['8.8.8.8', '1.1.1.1']);

const app = express();
const PORT = 5000;
const HOST = '127.0.0.1';
const DB_NAME = 'studentAssignmentDB';

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB collection reference
let assignmentsCollection;

// Middleware helper to check if database is connected
function checkDatabase(req, res, next) {
  if (!assignmentsCollection) {
    return res.status(503).json({ error: 'Database is not connected' });
  }
  next();
}

// 1. Health check route
app.get('/', (req, res) => {
  res.json({ message: 'Student Assignment Tracker API is running' });
});

// 2. GET /assignments - Get all assignments
app.get('/assignments', checkDatabase, async (req, res) => {
  try {
    const assignments = await assignmentsCollection.find().toArray();
    res.status(200).json(assignments);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch assignments' });
  }
});

// 3. POST /assignments - Add a new assignment
app.post('/assignments', checkDatabase, async (req, res) => {
  try {
    const { title, subject, dueDate } = req.body;

    if (!title || !title.trim() || !subject || !subject.trim() || !dueDate || !dueDate.trim()) {
      return res.status(400).json({ error: 'Title, subject, and due date are required.' });
    }

    const newAssignment = {
      title: title.trim(),
      subject: subject.trim(),
      dueDate: dueDate.trim(),
    };

    const result = await assignmentsCollection.insertOne(newAssignment);
    res.status(201).json({
      message: 'Assignment added successfully',
      assignment: { _id: result.insertedId, ...newAssignment },
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to add assignment' });
  }
});

// 4. DELETE /assignments/:id - Delete an assignment by ID
app.delete('/assignments/:id', checkDatabase, async (req, res) => {
  try {
    const { id } = req.params;

    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid assignment ID format' });
    }

    const result = await assignmentsCollection.deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return res.status(404).json({ error: 'Assignment not found' });
    }

    res.status(200).json({ message: 'Assignment deleted successfully', id });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete assignment' });
  }
});

// Connect to MongoDB Atlas first, then start the Express server
async function startServer() {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    console.error('ERROR: MONGODB_URI is missing in backend/.env');
    return;
  }

  try {
    console.log('Connecting to MongoDB Atlas...');
    const client = new MongoClient(uri);
    await client.connect();
    const db = client.db(DB_NAME);
    assignmentsCollection = db.collection('assignments');
    console.log('Connected to MongoDB Atlas successfully!');

    app.listen(PORT, HOST, () => {
      console.log(`Server is running on http://${HOST}:${PORT}`);
    });
  } catch (error) {
    console.error('Could not connect to MongoDB Atlas:', error.message);
  }
}

startServer();
