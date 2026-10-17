const express = require("express");
const mongoose = require("mongoose");

const app = express();

app.use(express.json());

// Connect to MongoDB
mongoose.connect("mongodb://127.0.0.1:27017/studentDB")
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.log(err));

// Student Schema
const studentSchema = new mongoose.Schema({
  name: String,
  city: String,
  marks: Number
});

// Student Model
const Student = mongoose.model("Student", studentSchema);

// GET - show all students
app.get("/students", async (req, res) => {
  const students = await Student.find();
  res.json(students);
});

// POST - add a student
app.post("/students", async (req, res) => {
  const student = await Student.create(req.body);
  res.send("Student added");
});

// PUT - update a student
app.put("/students/:id", async (req, res) => {
  await Student.findByIdAndUpdate(
    req.params.id,
    req.body,
    { runValidators: true }
  );
  res.send("Student updated");
});

// DELETE - delete a student
app.delete("/students/:id", async (req, res) => {
  await Student.findByIdAndDelete(req.params.id);
  res.send("Student deleted");
});

// Start server
app.listen(3000, () => {
  console.log("Server started on port 3000");
});