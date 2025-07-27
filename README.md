# CARPART

# 🧩 Autoparts Platform – MERN Stack

A modular and scalable full-stack web platform for managing auto parts, built with the **MERN stack** (MongoDB, Express.js, React, Node.js).

---

## ✅ Features Implemented (Initial Release)

- 🔐 **User Authentication**
  - Sign Up (with validation and error handling)
  - Sign In (with JWT-based session handling)
- 👤 **Roles Management**
  - Admin and User role-based access control (RBAC)
  - Role middleware for protected routes

---

## 🚀 Tech Stack

| Frontend  | Backend     | Database  | Auth         |
|-----------|-------------|-----------|--------------|
| React     | Node + Express | MongoDB   | JWT / Bcrypt |

---

## 📁 Project Structure

```bash
/autoparts-platform
├── /client        # React frontend
│   └── /src/pages/auth/SignIn.jsx
│   └── /src/pages/auth/SignUp.jsx
├── /server        # Express backend
│   └── /routes/authRoutes.js
│   └── /controllers/authController.js
│   └── /middlewares/roleMiddleware.js
│   └── /models/User.js
├── .env.example
├── README.md
