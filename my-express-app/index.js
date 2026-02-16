const express = require('express');
const app = express();
const PORT = 3000;

app.use(express.json()); 

let students = [
    { id: 1, name: "node", age: 18 },
    { id: 2, name: "express", age: 19 },
    { id: 3, name: "javascript", age: 20 }
];


const checkStudentData = (req, res, next) => {
    if (!req.body.name || !req.body.age) {
        return res.status(400).send("Invalid data");
    }
    next();
};

app.get('/students', (req, res) => {
    res.json(students);
});

app.get('/students/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const student = students.find(s => s.id === id);
    if (student) {
        res.json(student);
    } else {
        res.status(404).send("Student not found");
    }
});

app.post('/students', checkStudentData, (req, res) => {
    const newId = students.length > 0 ? students[students.length - 1].id + 1 : 1;
    const newStudent = {
        id: newId,
        name: req.body.name,
        age: req.body.age
    };
    students.push(newStudent);
    res.json(newStudent);
});

app.put('/students/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const index = students.findIndex(s => s.id === id);
    if (index !== -1) {
        students[index] = { ...students[index], ...req.body };
        res.json(students[index]);
    } else {
        res.status(404).send("Student not found");
    }
});

app.delete('/students/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const index = students.findIndex(s => s.id === id);
    if (index !== -1) {
        const deleted = students.splice(index, 1);
        res.json(deleted[0]);
    } else {
        res.status(404).send("Student not found");
    }
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}/students`);
});