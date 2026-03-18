
# Task Manager — MERN Stack

A full-stack Task Management application where users can register, log in, and manage their tasks with filtering, search, pagination, and status tracking.

---

## Tech Stack

| Layer | Technologies |
|---|---|
| Frontend | React (Vite), TypeScript, Zustand, Tailwind CSS |
| Backend | Node.js, Express.js, TypeScript |
| Database | MongoDB (Mongoose) |
| Auth | JWT stored in HTTP-only cookies |

---

## Features

- User authentication with JWT + HTTP-only cookies
- Create, read, update, and delete tasks
- Mark tasks as completed or pending
- Filter by status — All / Pending / Completed
- Search tasks by title or description
- Pagination
- Dashboard with task statistics
- Responsive UI with Tailwind CSS

---


## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/michael-020/task-manager.git
```
```bash
cd task-manager
```


### 2. Configure environment variables

**Backend** — `/server/.env`

```env
PORT=3000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
NODE_ENV=development
```

**Frontend** — `/client/.env`

```env
VITE_API_URL=http://localhost:3000
```

### 3. Run the backend

```bash
cd server
npm install
npm run dev
```

Runs on `http://localhost:3000`

### 4. Run the frontend

```bash
cd client
npm install
npm run dev
```

Runs on `http://localhost:5173`

---

## Notes

- Ensure MongoDB is running locally or use MongoDB Atlas.
- Frontend requests must include credentials since auth uses HTTP-only cookies.
- Update CORS and cookie settings before deploying to production.
