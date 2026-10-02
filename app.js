const express = require('express');
const path = require('path');

const app = express();
const PORT = 3000;

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, '..', 'public')));

// ข้อมูลตัวอย่าง
let tasks = [
  {
    id: 1,
    title: 'ทำ Mini Project',
    description: 'สร้าง REST API ด้วย Node.js และ Express.js',
    done: false
  },
  {
    id: 2,
    title: 'อ่านบทเรียน REST API',
    description: 'ทบทวน GET POST PATCH และ DELETE',
    done: true
  }
];

let nextId = 3;


// ========================================
// GET /api/tasks
// ดึงรายการทั้งหมด
// รองรับ ?done=true / ?done=false
// ========================================
app.get('/api/tasks', (req, res) => {
  const { done } = req.query;

  let result = tasks;

  if (done !== undefined) {

    if (done !== 'true' && done !== 'false') {
      return res.status(400).json({
        error: 'done must be true or false'
      });
    }

    const doneValue = done === 'true';

    result = tasks.filter(task => task.done === doneValue);
  }

  res.status(200).json(result);
});


// ========================================
// GET /api/tasks/:id
// ดึงรายการเดียว
// ========================================
app.get('/api/tasks/:id', (req, res) => {

  const id = Number(req.params.id);

  const task = tasks.find(task => task.id === id);

  if (!task) {
    return res.status(404).json({
      error: 'Task not found'
    });
  }

  res.status(200).json(task);
});


// ========================================
// POST /api/tasks
// เพิ่มรายการใหม่
// ========================================
app.post('/api/tasks', (req, res) => {

  const {
    title,
    description = '',
    done = false
  } = req.body;

  // ตรวจสอบ title
  if (
    !title ||
    typeof title !== 'string' ||
    !title.trim()
  ) {
    return res.status(400).json({
      error: 'title is required'
    });
  }

  // ตรวจสอบ description
  if (typeof description !== 'string') {
    return res.status(400).json({
      error: 'description must be a string'
    });
  }

  // ตรวจสอบ done
  if (typeof done !== 'boolean') {
    return res.status(400).json({
      error: 'done must be a boolean'
    });
  }

  const newTask = {
    id: nextId++,
    title: title.trim(),
    description: description.trim(),
    done
  };

  tasks.push(newTask);

  res.status(201).json(newTask);
});


// ========================================
// PATCH /api/tasks/:id
// แก้ไขรายการ
// ========================================
app.patch('/api/tasks/:id', (req, res) => {

  const id = Number(req.params.id);

  const task = tasks.find(task => task.id === id);

  if (!task) {
    return res.status(404).json({
      error: 'Task not found'
    });
  }

  const {
    title,
    description,
    done
  } = req.body;


  // แก้ title
  if (title !== undefined) {

    if (
      typeof title !== 'string' ||
      !title.trim()
    ) {
      return res.status(400).json({
        error: 'title must be a non-empty string'
      });
    }

    task.title = title.trim();
  }


  // แก้ description
  if (description !== undefined) {

    if (typeof description !== 'string') {
      return res.status(400).json({
        error: 'description must be a string'
      });
    }

    task.description = description.trim();
  }


  // แก้สถานะ
  if (done !== undefined) {

    if (typeof done !== 'boolean') {
      return res.status(400).json({
        error: 'done must be a boolean'
      });
    }

    task.done = done;
  }


  res.status(200).json(task);
});


// ========================================
// DELETE /api/tasks/:id
// ลบรายการ
// ========================================
app.delete('/api/tasks/:id', (req, res) => {

  const id = Number(req.params.id);

  const index = tasks.findIndex(
    task => task.id === id
  );

  if (index === -1) {
    return res.status(404).json({
      error: 'Task not found'
    });
  }

  tasks.splice(index, 1);

  // ตามโจทย์ต้องเป็น 204
  res.status(204).send();
});


// ========================================
// เปิดหน้าเว็บไซต์
// ========================================
app.get('*', (req, res) => {
  res.sendFile(
    path.join(__dirname, '..', 'public', 'index.html')
  );
});


// ========================================
// Start Server
// ========================================
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});