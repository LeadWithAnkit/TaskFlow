# TaskFlow

TaskFlow is a modern, full-stack Role-Based Task and Project Management application built with the PERN stack (PostgreSQL, Express, React, Node.js) and styled with a sleek, premium "z-black" glassmorphic UI.

## Features

- **Role-Based Access Control (RBAC):** Strict isolation between `ADMIN` and `MEMBER` roles.
  - **Admins:** Have full control over managing users, creating/deleting projects, creating/deleting tasks, and assigning tasks.
  - **Members:** Can only view and update tasks specifically assigned to them, or view unassigned global tasks.
- **Project Management:** Group tasks into overarching projects, manage project members, and track project-specific progress.
- **Kanban Board:** A dynamic drag-and-drop task board to seamlessly move tasks between "To Do", "In Progress", and "Done" states.
- **Real-Time Dashboard:** Overview statistics dynamically filtered based on the logged-in user's role and assigned tasks.
- **Premium UI:** A highly responsive, dark-mode focused glassmorphic design utilizing Tailwind CSS.

## Tech Stack

- **Frontend:** React, Vite, Tailwind CSS, Axios
- **Backend:** Node.js, Express.js, JSON Web Tokens (JWT) for authentication
- **Database:** PostgreSQL managed via Prisma ORM

## Getting Started

### Prerequisites
- Node.js (v18+)
- PostgreSQL Database

### Installation

1. **Clone the repository:**
   ```bash
   git clone (https://github.com/LeadWithAnkit/TaskFlow)
   cd TaskFlow
   ```

2. **Backend Setup:**
   ```bash
   cd backend
   npm install
   ```
   Create a `.env` file in the `backend/` directory with the following variables:
   ```env
   PORT=5000
   DATABASE_URL="postgresql://user:password@localhost:5432/taskflow?schema=public"
   JWT_SECRET="your_jwt_secret_key"
   
   # Admin Seeding Variables
   ADMIN_NAME="Admin"
   ADMIN_EMAIL="admin@taskflow.com"
   ADMIN_PASSWORD="securepassword"
   ```
   Initialize the database:
   ```bash
   npx prisma db push
   npx prisma generate
   node prisma/seed.js # Seeds the initial Admin account
   npm run dev
   ```

3. **Frontend Setup:**
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

## License
MIT License
