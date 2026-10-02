# My To-Do List REST API Mini Project

โปรเจกต์ Mini Project สำหรับการพัฒนา Web Application แบบ Full-Stack
โดยใช้ Node.js และ Express.js ในการสร้าง REST API และใช้ HTML, CSS และ JavaScript
สำหรับพัฒนา Frontend

## 1. รายละเอียดโปรเจกต์

My To-Do List เป็นเว็บแอปพลิเคชันสำหรับจัดการรายการสิ่งที่ต้องทำ
ผู้ใช้สามารถเพิ่ม แก้ไข เปลี่ยนสถานะ และลบรายการงานได้

Frontend เชื่อมต่อกับ Backend ผ่าน REST API โดยใช้ JavaScript `fetch()`
และสามารถอัปเดตข้อมูลบนหน้าเว็บโดยไม่ต้อง Reload หน้า

## 2. เทคโนโลยีที่ใช้

- Node.js
- Express.js
- HTML5
- CSS3
- JavaScript
- REST API
- Fetch API

## 3. ความสามารถของระบบ

- เพิ่มรายการงาน
- แสดงรายการงาน
- แก้ไขรายการงาน
- เปลี่ยนสถานะงานเป็นเสร็จแล้ว / ยังไม่เสร็จ
- ลบรายการงาน
- กรองรายการตามสถานะ
- ตรวจสอบข้อมูลก่อนเพิ่มหรือแก้ไข
- แสดง Error กรณีไม่พบข้อมูล

## 4. โครงสร้างโปรเจกต์

```text
server mini/
├── server/
│   └── app.js
├── public/
│   ├── index.html
│   ├── script.js
│   └── style.css
├── screenshots/
├── report/
├── package.json
├── package-lock.json
├── .gitignore
└── README.md
