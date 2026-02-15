const express = require('express');
const app = express();
const PORT = 3000;

app.use(express.json()); // ต้องมีเพื่อให้อ่าน JSON ได้

// ข้อมูลเริ่มต้น (ตามโจทย์ Workshop 5.1)
let students = [
    { id: 1, name: "node", age: 18 },
    { id: 2, name: "express", age: 19 },
    { id: 3, name: "javascript", age: 20 }
];

// --- Workshop 5.2: Middleware ตรวจสอบข้อมูล ---
const checkStudentData = (req, res, next) => {
    // เช็คว่ามี name และ age ส่งมาไหม
    if (!req.body.name || !req.body.age) {
        return res.status(400).send("Invalid data");
    }
    next(); // ถ้าครบถ้วน ให้ไปทำงานต่อที่ API หลัก
};

// --- Workshop 5.1: API Endpoints ---

// 1. GET ทั้งหมด
app.get('/students', (req, res) => {
    res.json(students);
});

// 2. GET ตาม ID
app.get('/students/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const student = students.find(s => s.id === id);
    if (student) {
        res.json(student);
    } else {
        res.status(404).send("Student not found");
    }
});

// 3. POST เพิ่มข้อมูล (ใส่ Middleware checkStudentData คั่นไว้ตรงกลาง)
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

// 4. PUT แก้ไขข้อมูล
app.put('/students/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const index = students.findIndex(s => s.id === id);
    if (index !== -1) {
        // แก้ไขเฉพาะข้อมูลที่ส่งมา หรือถ้าจะบังคับให้ครบก็ใส่ checkStudentData ได้เช่นกัน
        students[index] = { ...students[index], ...req.body };
        res.json(students[index]);
    } else {
        res.status(404).send("Student not found");
    }
});

// 5. DELETE ลบข้อมูล
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