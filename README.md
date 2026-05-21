# TaskFlow — Team Task Management Platform

TaskFlow is a full-stack team collaboration and task management platform built using the PERN stack.  
It supports project management, task assignment, role-based access control, dashboard analytics, and secure authentication.

---

# Live Demo

🔗 Live Application:  
https://taskfloww-production-e5f8.up.railway.app/auth

💻 GitHub Repository:  
https://github.com/LeadWithAnkit/TaskFlow

---

# Features

- JWT Authentication
- Role-Based Access Control (Admin / Member)
- Project & Team Management
- Task Assignment & Tracking
- Dashboard Analytics
- Overdue Task Monitoring
- RESTful APIs
- Secure Backend Architecture
- PostgreSQL Relational Database
- Railway Deployment

---

# Tech Stack

## Frontend
- React 18
- Vite
- Tailwind CSS
- Axios
- React Router DOM

## Backend
- Node.js
- Express.js

## Database
- PostgreSQL
- Prisma ORM

## Deployment
- Railway

## Additional Services
- Upstash Redis

---

# Frontend Architecture

## Frontend Flow

```text
User Action
   ↓
React Components
   ↓
Axios / Context API
   ↓
Backend REST APIs
   ↓
Express Server
   ↓
Prisma ORM
   ↓
PostgreSQL Database
```

## Frontend Folder Structure

```text
frontend/
│
├── public/
├── src/
│   ├── assets/
│   ├── components/
│   ├── context/
│   ├── layouts/
│   ├── pages/
│   ├── utils/
│   ├── App.jsx
│   └── main.jsx
│
├── package.json
└── vite.config.js
```

---

# Backend Architecture

## Backend Flow

```text
Client Request
      ↓
Express Routes
      ↓
Controllers
      ↓
Middleware
      ↓
Prisma ORM
      ↓
PostgreSQL Database
```

## Backend Folder Structure

```text
backend/
│
├── prisma/
│   ├── schema.prisma
│   └── seed.js
│
├── src/
│   ├── controllers/
│   ├── middleware/
│   ├── routes/
│   ├── utils/
│   ├── lib/
│   └── server.js
│
├── package.json
└── prisma.config.ts
```

---

# Database Design

```text
User
 ├── Projects
 ├── Assigned Tasks
 └── Roles

Project
 ├── Members
 └── Tasks

Task
 ├── Assigned User
 ├── Project
 └── Status/Priority
```

---

# API Routes

```text
/api/auth
/api/projects
/api/tasks
/api/dashboard
/api/users
```

---

# Environment Variables

## Backend `.env`

```env
DATABASE_URL=
JWT_SECRET=

ADMIN_EMAIL=
ADMIN_PASSWORD=

UPSTASH_REDIS_REST_URL=
UPSTASH_REDIS_REST_TOKEN=
```

## Frontend `.env`

```env
VITE_API_URL=
```

---

# Local Setup

## Clone Repository

```bash
git clone https://github.com/LeadWithAnkit/TaskFlow

cd TaskFlow
```

---

# Backend Setup

```bash
cd backend

npm install

npx prisma generate

npx prisma db push

node prisma/seed.js

npm start
```

Backend runs on:

```text
http://localhost:5000
```

---

# Frontend Setup

```bash
cd frontend

npm install

npm run dev
```

Frontend runs on:

```text
http://localhost:5173
```

---

# Deployment

The application is fully deployed on Railway.

## Deployment Stack

- Frontend → Railway
- Backend → Railway
- PostgreSQL → Railway PostgreSQL

---

# Learning Outcomes

- Full-stack architecture design
- PostgreSQL relational database design
- Prisma ORM integration
- Railway deployment workflows
- JWT authentication
- REST API development
- Production debugging & deployment
- Environment variable management

---

# Author

## Ankit Kumar Tiwari

GitHub:  
https://github.com/LeadWithAnkit

LinkedIn:  
https://www.linkedin.com/in/ankit-kumar-tiwari/

---

# Future Improvements

- Real-time notifications
- Team chat system
- Activity logs
- Drag & Drop Kanban Board
- WebSocket integration
- Email notifications

---

# License

This project is built for educational and technical assessment purposes.
