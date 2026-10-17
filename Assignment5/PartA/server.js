const express = require("express");
const app = express();
app.use(express.json());
let students = [
    { id: 1, name: "Aayush", marks: 94 },
    { id: 2, name: "Om", marks: 88 },
    { id: 3, name: "Soham", marks: 96 }
];
app.post("/students", (req, res) => {
    let student = {
        id: students.length + 1,
        name: req.body.name,
        marks: req.body.marks
    };
    students.push(student);
    res.send(student);
});
app.get("/students", (req, res) => {
    res.json(students);
});
app.get("/students/:id", (req, res) => {
    let id = Number(req.params.id);
    let found = false;
    for (let i = 0; i < students.length; i++) {
        if (students[i].id == id) {
            res.json(students[i]);
            found = true;
        }
    }
    if (found == false) {
        res.send("Student not found");
    } else {
        console.log("Student found");
    }
});
app.put("/students/:id", (req, res) => {
    let id = Number(req.params.id);
    let found = false;
    for (let i = 0; i < students.length; i++) {
        if (students[i].id == id) {
            students[i].name = req.body.name;
            students[i].marks = req.body.marks;
            found = true;
        }
    }
    if (found == true) {
        res.send("Student updated successfully");
    } else {
        res.send("Student not found");
    }
});
app.delete("/students/:id", (req, res) => {
    let id = Number(req.params.id);
    let found = false;
    for (let i = 0; i < students.length; i++) {
        if (students[i].id == id) {
            students.splice(i, 1);
            found = true;
        }
    }
    if (found == true) {
        res.send("Student deleted successfully");
    } else {
        res.send("Student not found");
    }
});
app.listen(3000, () => {
    console.log("Server is running on port 3000");
});