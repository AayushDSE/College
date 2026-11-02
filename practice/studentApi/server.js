const express = require("express");
const mongoose = require("mongoose");

const app = express();

app.use(express.json());

// Connect MongoDB
mongoose.connect("mongodb://127.0.0.1:27017/college")
    .then(() => console.log("Database Connected"))
    .catch(err => console.log(err));

// Student Model
const Student = mongoose.model("Student", {
    name: String,
    rollNo: Number,
    course: String
});

// CREATE
app.post("/students", async (req, res) => {
    let student = await Student.create(req.body);
    res.json(student);
});

// READ
app.get("/students", async (req, res) => {
    let students = await Student.find();
    res.json(students);
});

// UPDATE - Practical 10
app.put("/students/:id", async (req, res) => {
    let student = await Student.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
    );

    res.json(student);
});

// SEARCH - Practical 11
app.get("/students/search/:name", async (req, res) => {
    let students = await Student.find({
        name: { $regex: req.params.name, $options: "i" }
    });

    res.json(students);
});

// DELETE - Practical 12
app.delete("/students/:id", async (req, res) => {
    await Student.findByIdAndDelete(req.params.id);
    res.json({ message: "Student Deleted" });
});

// Start Server
app.listen(3000, () => {
    console.log("Server running on port 3000");
});