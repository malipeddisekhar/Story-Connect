🌍 StoryConnect

A professional storytelling platform for authors, readers, and admins

Live Demo: https://storyconnect-frontend.onrender.com/#/

Backend & Frontend: React + Express + MySQL
Collaboration Contact:
📩 malipeddisekhar63@gmail.com

📞 +91 91105 73442

🎯 Project Aim

StoryConnect is designed to function as a real-time, production-ready platform where:

Writers publish stories

Readers discover, like, and comment

Admins manage users and maintain content quality

This application demonstrates full-stack development, secure role-based access, and deployment using Render, suitable for college projects, portfolios, or startup MVPs.

🏗️ Architecture Overview
Layer	Technology
Frontend	React + Vite
Backend	Node.js + Express
Database	MySQL
Auth	JWT-based secure login
Hosting	Render/Cloud

Roles implemented:

Admin – Total control (users, stories)

Author – Post stories, manage their own content

Reader – Explore, like, bookmark, comment & follow authors

🚀 Live Deployment
Module	Hosted URL
Frontend	https://storyconnect-frontend.onrender.com/#/

Backend	(Deploy your backend on Render / Railway / Vercel or local machine)

The frontend is live and fully functional.
Backend setup required to enable full data flow if running locally.

🛠️ Run Locally – Quick Start
📌 Prerequisites

Node.js 18+

MySQL Server

📥 Clone & Install
git clone https://github.com/YOUR_REPO/storyconnect.git
cd storyconnect
npm install
cd server && npm install

🗄️ Setup MySQL

Run:

mysql -u root -p < setup-database.sql


Update MySQL password:
📂 server/index.js → around line 18

▶️ Start Servers
Start Backend
cd server
node index.js

Start Frontend
npm run dev


Open 👉 http://localhost:3000/

👤 Test Accounts
Role	Email	Password
Admin	admin@storyconnect.com
	password123
Author	jane@storyconnect.com
	password123
Reader	reader@storyconnect.com
	password123
🌟 Features
Reader Functionality

🔍 Explore stories

❤️ Like & bookmark

💬 Comment

👤 Follow favorite authors

Author Functionality

✍️ Create stories

📝 Manage published content

📈 Build audience

Admin Functionality

🧑‍✈️ Manage users (add/disable/delete)

🧹 Monitor platform activity

🛡️ Maintain platform quality

📦 Folder Structure (High Level)
/client         → React frontend
/server         → Express backend
/setup-database.sql → DB schema & seed

🧩 Technology Stack

React + Vite

Express.js

JWT Authentication

BCrypt password security

MySQL & SQL migrations

Axios communication

🤝 Want to Collaborate?
💬 Contact

📩 malipeddisekhar63@gmail.com

📞 +91 91105 73442

Contributors, UI designers, backend developers & testers welcome 🚀
Let’s grow StoryConnect together ❤️
