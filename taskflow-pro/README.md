# TaskFlow Pro 🚀

A full-featured, modern SaaS-style task management web application built with the MERN stack, real-time updates via Socket.io, and a premium UI inspired by Notion, ClickUp, Trello, and Monday.com.

![TaskFlow Pro](https://img.shields.io/badge/status-production--ready-4F46E5)

## ✨ Features

- **Authentication**: JWT-based register/login, password hashing with bcrypt, "Remember Me", role-based authorization (Admin/User)
- **Task Management**: Create, edit, delete, complete/reopen tasks with priority (High/Medium/Low), categories, due dates, and assignments
- **Dashboard Analytics**: Total/completed/pending/overdue stats, completion percentage, priority breakdown (pie chart), weekly productivity (bar chart), progress bars
- **Advanced Task Tools**: Search, filter (status/priority), sort, pagination
- **Real-time Updates**: Live task sync and notifications via Socket.io
- **Dark Mode**: Full light/dark theme support with persisted preference
- **Modern UI**: Glassmorphism, smooth Framer Motion animations, loading skeletons, toast notifications, responsive sidebar & mobile nav
- **Profile & Settings**: Editable profile, password change, preference toggles
- **Activity Logs**: Track all task and account actions

## 🛠 Tech Stack

**Frontend:** React (Vite), Tailwind CSS, React Router, Axios, Framer Motion, React Hook Form, Recharts, Socket.io-client, React Hot Toast

**Backend:** Node.js, Express.js, MongoDB, Mongoose, JWT, bcryptjs, Socket.io, express-validator

## 📁 Project Structure

```
taskflow-pro/
├── frontend/          # React + Vite client
│   ├── src/
│   │   ├── components/   # Reusable UI components
│   │   ├── pages/         # Route-level pages
│   │   ├── layouts/        # Auth & Dashboard layouts
│   │   ├── hooks/           # Custom hooks (useTasks, useDebounce)
│   │   ├── services/         # Axios API & socket services
│   │   ├── context/           # Auth, Theme, Notification contexts
│   │   └── utils/               # Helper functions
│   └── package.json
│
├── backend/           # Express API server
│   ├── controllers/   # Route logic
│   ├── routes/         # API routes
│   ├── middleware/      # Auth, validation, error handling
│   ├── models/            # Mongoose schemas
│   ├── config/             # DB connection
│   ├── utils/                # Token generation
│   └── server.js
│
└── README.md
```

## ⚙️ Setup Instructions

### Prerequisites
- Node.js v18+
- MongoDB Atlas account (or local MongoDB)

### 1. Clone & Install

```bash
git clone <your-repo-url>
cd taskflow-pro
```

**Backend:**
```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your MongoDB URI and JWT secret
npm run dev
```

**Frontend (new terminal):**
```bash
cd frontend
npm install
cp .env.example .env
# Edit .env if your backend runs on a different URL
npm run dev
```

The app will be available at `http://localhost:5173` and the API at `http://localhost:5000`.

### 2. Environment Variables

**backend/.env**
```
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/taskflow-pro
JWT_SECRET=your_super_secret_jwt_key
JWT_EXPIRE=7d
JWT_REMEMBER_EXPIRE=30d
CLIENT_URL=http://localhost:5173
```

**frontend/.env**
```
VITE_API_URL=http://localhost:5000/api
VITE_SOCKET_URL=http://localhost:5000
```

## 🔌 API Endpoints

### Auth
| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| POST | `/api/auth/register` | Register a new user | Public |
| POST | `/api/auth/login` | Login user | Public |
| GET | `/api/auth/profile` | Get current user profile | Private |
| PUT | `/api/auth/profile` | Update profile/settings/password | Private |
| GET | `/api/auth/users` | List all users | Admin |

### Tasks
| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/api/tasks` | Get tasks (search, filter, sort, paginate) | Private |
| GET | `/api/tasks/:id` | Get single task | Private |
| POST | `/api/tasks` | Create task | Private |
| PUT | `/api/tasks/:id` | Update task | Private |
| DELETE | `/api/tasks/:id` | Delete task | Private |
| GET | `/api/tasks/stats/dashboard` | Get dashboard analytics | Private |

### Activity
| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/api/activity` | Get activity logs | Private |

## 🚀 Deployment

### Backend (Render)
1. Create a new Web Service, connect your repo, set root directory to `backend`
2. Build command: `npm install`
3. Start command: `npm start`
4. Add environment variables from `.env.example`

### Frontend (Vercel)
1. Import the repo, set root directory to `frontend`
2. Framework preset: Vite
3. Add `VITE_API_URL` and `VITE_SOCKET_URL` pointing to your deployed backend
4. The included `vercel.json` handles SPA routing rewrites

## 🎨 Design System

| Element | Value |
|---------|-------|
| Primary | `#4F46E5` |
| Secondary | `#7C3AED` |
| Accent | `#06B6D4` |
| Background (light) | `#F8FAFC` |
| Background (dark) | `#0F172A` |

## 📄 License

MIT — free to use for personal portfolios and commercial projects.
