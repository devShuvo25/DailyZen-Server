# 🧠 DailyZone Server (Express + MongoDB)

This is the **backend API** for the DailyZone https://dailyzone.netlify.app/ habit tracking web application.  
It provides secure and efficient endpoints to manage user habits, completion tracking, and progress streaks.

---

## 🚀 Features

- ⚡ **RESTful API with Express.js** – Lightweight and high-performance server.  
- 🧩 **MongoDB Integration** – All data stored and managed through MongoDB Atlas.  
- 🧮 **Dynamic Streak Calculation** – Automatically tracks and updates habit streaks.  
- 🔐 **User-Specific Queries** – Fetch habits for a specific user by email.  
- 🗓️ **Completion History** – Keeps a log of completed days for each habit.  
- 🧰 **Full CRUD Support** – Add, update, delete, and retrieve habits easily.  

---

## 🧩 Tech Stack

- **Server:** Node.js + Express.js  
- **Database:** MongoDB (via MongoDB Atlas)  
- **Environment Variables:** dotenv  
- **CORS:** Enabled for cross-origin communication  
- **Deployment:** Render / Vercel / Railway (your choice)

---

## ⚙️ API Endpoints

| Method | Endpoint | Description |
|---------|-----------|-------------|
| `GET` | `/` | Test route (Server running confirmation) |
| `GET` | `/all-habits` | Fetch all habits (sorted by latest) |
| `GET` | `/latest-fatures` | Fetch the latest 6 habits |
| `GET` | `/my-habits?email=user@example.com` | Fetch habits of a specific user |
| `GET` | `/current-product/:id` | Get a single habit by ID |
| `POST` | `/add-habit` | Add a new habit |
| `PATCH` | `/update-my-habit/:id` | Update an existing habit |
| `PATCH` | `/habits-complete/:id` | Mark habit as completed for today & update streak |
| `DELETE` | `/delet-this-habit/:id` | Delete a habit by ID |

---
