# Auto Spare Parts Platform

A full-featured platform for managing auto spare parts, built with the MERN stack (MongoDB, Express.js, React, Node.js).

---

## ✅ Features

- 🔐 User authentication and login (with role-based access)
- 👤 Role management (superadmin, admin, vendor)
- 🛒 Product management (add, edit, delete, image upload)
- 📦 Vendor dashboard
- 🛡️ Security improvements (JWT, Bcrypt, middlewares)

---

## 🚀 Tech Stack

| Frontend | Backend        | Database | Auth        |
|----------|---------------|----------|-------------|
| React    | Node + Express| MongoDB  | JWT/Bcrypt  |

---

## 📁 Project Structure

```bash
carpart/
├── client/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── utils/
│   │   ├── App.js
│   │   └── index.js
│   ├── package.json
│   └── package-lock.json
├── server/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── scripts/
│   ├── uploads/
│   ├── SECURITY_IMPROVEMENTS.md
│   ├── server.js
│   ├── package.json
│   └── package-lock.json
├── SuperAdmin.txt
├── .gitignore
└── README.md
```

---

## ℹ️ How to Run

1. Install dependencies in both `client` and `server`:
   ```sh
   cd carpart/client && npm install
   cd ../server && npm install
   ```
2. Set up environment variables if needed (see `.env.example` if available).
3. Start the backend:
   ```sh
   npm run dev
   ```
4. Start the frontend:
   ```sh
   cd ../client
   npm start
   ```

---

## 📢 Notes
- Superadmin credentials are in `SuperAdmin.txt` or can be created using the script at `server/scripts/createSuperadmin.js`.
- Product images are stored in `server/uploads/`.
- See `SECURITY_IMPROVEMENTS.md` for security notes.
