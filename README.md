# 🌍 StoryConnect  
_A modern storytelling platform built with React, Express & MySQL_

🔗 **Live Demo:** https://storyconnect-frontend.onrender.com/#/  
📩 **Contact:** malipeddisekhar63@gmail.com  
📞 **+91 91105 73442**

---

## 🎯 Overview

StoryConnect is a full-stack storytelling platform where:
- **Readers** discover stories, like, bookmark & comment
- **Authors** publish stories and grow followers
- **Admins** manage users & platform content

Designed to run in real-time and deployed for public access.

---

## 🛠️ Tech Stack

| Area | Tech |
|------|------|
| Frontend | React + Vite |
| Backend | Node.js + Express |
| Database | MySQL |
| Auth | JWT + bcrypt |
| Hosting | Render (Frontend) |

---

## ✨ Core Features
- 👤 Role-based access (Admin / Author / Reader)
- ✍️ Publish & manage stories
- 📚 Browse & read stories
- ❤️ Likes, 🔖 bookmarks, 💬 comments
- 👥 Follow authors
- 🛠️ Admin user management

---

## 🚀 Getting Started

### 1️⃣ Prerequisites
- Node.js 18+
- MySQL Server installed

---

### 2️⃣ Clone the Repo
```bash
git clone https://github.com/YOUR-USERNAME/storyconnect.git
cd storyconnect
```

---

### 3️⃣ Install Dependencies
```bash
npm install
cd server && npm install
```

---

### 4️⃣ Setup Database
Run SQL:
```bash
mysql -u root -p < setup-database.sql
```

Update MySQL password:
```
server/index.js (around line 18)
```

---

### 5️⃣ Run the App

#### Start Backend
```bash
cd server
node index.js
```

#### Start Frontend
```bash
npm run dev
```

Open in browser:
```
http://localhost:3000/
```

---

## 🔐 Test Accounts

| Role | Email | Password |
|------|--------|----------|
| Admin | admin@storyconnect.com | password123 |
| Author | jane@storyconnect.com | password123 |
| Reader | reader@storyconnect.com | password123 |

---

## 📁 Folder Structure
```
storyconnect/
│
├── client/              # React frontend
│   ├── src/
│   └── vite.config.js
│
├── server/              # Express backend
│   ├── controllers/
│   ├── routes/
│   ├── db.js
│   └── index.js
│
├── setup-database.sql   # MySQL schema & seeds
└── README.md
```

---

## 🌱 Future Roadmap
- 📸 Story cover uploads
- 📊 Analytics dashboard
- 🔔 Real-time notifications
- 🌐 Multi-language
- 📱 Mobile app version

---

## 🤝 Contributing

Pull requests & new ideas welcome!
Want to collaborate, test, or expand modules?  
Reach out 👇

📩 **malipeddisekhar63@gmail.com**  
📞 **+91 91105 73442**

---

## 🏁 Final Note

StoryConnect is a full-stack, role-based storytelling platform  
built for **real-time deployment, teamwork & professional learning**.

Feel free to fork, clone, and level it up 🚀
