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

## 🔧 Project Root Structure

```bash
carpart/
├── client/                 # React Frontend
├── server/                 # Node.js + Express Backend
├── .gitignore
└── README.md
```


## 📁 Client Structure (/client)
This is your React app folder.

```bash
client/
├── public/
│   └── index.html
├── src/
│   ├── assets/             # Images, styles, etc.
│   ├── components/         # Reusable UI components
│   ├── context/            
│   ├── pages/              # Route-based components (e.g., Home, Login)
│   ├── routes/             # React Router config
│   ├── services/           # API calls (axios/fetch)
│   ├── App.js
│   ├── index.js
│   └── styles/             # Global styles (optional)
│       └── app.css
│       └── index.css
├── .env                    # React env variables
├── package.json
└── README.md
```


## 📁 Server Structure (/server)
This is your Express.js backend with MongoDB (via Mongoose).

```bash
server/
├── config/
│   └── db.js               # MongoDB connection
├── controllers/            # Logic for routes
│   └── userController.js
├── middleware/             # Auth, error handling, etc.
│   ├── authMiddleware.js
│   └── errorMiddleware.js
├── models/                 # Mongoose schemas
│   └── User.js
├── routes/                 # Express routes
│   └── userRoutes.js
├── utils/                  # Helper functions
├── .env                    # Server environment variables
├── server.js               # Entry point
├── package.json
└── README.md
<<<<<<< HEAD
```
=======
```
>>>>>>> ad1fcebce5035690b44cdfa333e5e4316e26b7d5
