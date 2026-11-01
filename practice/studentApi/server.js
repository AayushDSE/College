const express = require("express");
const mongoose = require("mongoose");

const app = express();

app.use(express.json());

// Connect to MongoDB
mongoose.connect("mongodb://127.0.0.1:27017/college")
    .then(() => console.log("MongoDB connected"))
    .catch(err => console.log(err));

// Student model
const Student = mongoose.model("Student", new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    rollNo: Number,
    course: String
}));

// CREATE: Add a student
app.post("/students", async (req, res) => {
    try {
        const student = await Student.create(req.body);
        res.status(201).json(student);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// READ: Get all students
app.get("/students", async (req, res) => {
    try {
        const students = await Student.find();
        res.json(students);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// UPDATE: Change a student by MongoDB ID
app.put("/students/:id", async (req, res) => {
    try {
        const student = await Student.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        if (!student) {
            return res.status(404).json({
                message: "Student not found"
            });
        }

        res.json(student);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// SEARCH: Find students by name
app.get("/students/search/:name", async (req, res) => {
    try {
        const students = await Student.find({
            name: {
                $regex: req.params.name,
                $options: "i"
            }
        });

        res.json(students);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// DELETE: Remove a student by MongoDB ID
app.delete("/students/:id", async (req, res) => {
    try {
        const student = await Student.findByIdAndDelete(
            req.params.id
        );

        if (!student) {
            return res.status(404).json({
                message: "Student not found"
            });
        }

        res.json({ message: "Student deleted successfully" });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Start the server
app.listen(3000, () => {
    console.log("Server running on port 3000");
});