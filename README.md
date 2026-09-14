# TypeRider – Type Fast. Ride Faster.

TypeRider is a full-stack typing race game. Your WPM and accuracy drive a **red** motorcycle against an **AI black** motorcycle in a one-minute race.

## Features

- Guest play (name + country + difficulty) without an account
- User signup/login with JWT and bcrypt
- Random topic selection per difficulty (Easy / Medium / Hard)
- Admin-managed topics that automatically join the random pool when active
- Live WPM, accuracy, streak, nitro boost, and smooth bike movement
- 3-2-1-GO countdown and 01:00 race timer
- Results, history for registered riders, and a global leaderboard
- Admin dashboard and topic CRUD (add / edit / delete / activate / deactivate)
- Responsive gaming UI

## Tech stack

- **Frontend:** React 18 (JSX), Vite, React Router, Framer Motion, Recharts, custom CSS
- **Backend:** Node.js, Express
- **Database:** MongoDB + Mongoose
- **Auth:** JWT, bcrypt

## Project structure

```
frontend/    React client
backend/     Express API
```

## Prerequisites

- Node.js 18+
- MongoDB running locally (default `mongodb://127.0.0.1:27017/typerider`) or a MongoDB Atlas URI

## Environment variables

### Backend `backend/.env`

| Variable | Description |
| --- | --- |
| `PORT` | API port (default `5000`) |
| `MONGO_URI` | MongoDB connection string |
| `JWT_SECRET` | Long random secret for JWT signing |
| `ADMIN_EMAIL` | Admin login email |
| `ADMIN_PASSWORD` | Admin login password (hashed at runtime, never sent to the frontend) |
| `CLIENT_ORIGIN` | Frontend origin for CORS |

Copy from `backend/.env.example`.

### Frontend `frontend/.env`

| Variable | Description |
| --- | --- |
| `VITE_API_URL` | API base URL, e.g. `http://localhost:5000/api` |

Copy from `frontend/.env.example`.

The Vite dev server also proxies `/api` to `http://localhost:5000`.

## Installation

### Backend

```bash
cd backend
npm install
npm run dev
```

On startup the API:

- Connects to MongoDB
- Seeds 15 default topics if the collection is empty (5 Easy, 5 Medium, 5 Hard)
- Ensures the admin account exists from `ADMIN_EMAIL` / `ADMIN_PASSWORD`

Manual seed:

```bash
npm run seed
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Open `http://localhost:5173`.

## Production build

```bash
cd frontend
npm run build
npm run preview
```

```bash
cd backend
npm start
```

## Default admin (development)

Configured in `backend/.env` (change immediately in production):

- Email: Configured in `backend/.env` as `ADMIN_EMAIL`
- Password: Configured in `backend/.env` as `ADMIN_PASSWORD`

Admin Login is in the navbar next to user Login.

## How topics work

Topics live in MongoDB, not in React. Each document has `title`, `difficulty`, `content`, and `isActive`.

`GET /api/topics/random/:difficulty` picks a random **active** topic for that difficulty only. The client sends recently used IDs so repeats are avoided when possible. New admin topics are included automatically.

## Main API routes

- `POST /api/auth/signup`
- `POST /api/auth/login`
- `GET /api/auth/profile`
- `POST /api/auth/admin/login`
- `GET /api/topics`
- `GET /api/topics/random/:difficulty`
- `POST /api/topics` (admin)
- `PUT /api/topics/:id` (admin)
- `DELETE /api/topics/:id` (admin)
- `PATCH /api/topics/:id/status` (admin)
- `POST /api/games`
- `GET /api/games/user`
- `GET /api/leaderboard`
- `GET /api/admin/dashboard`

## Gameplay

1. Play Now → name, country, difficulty
2. Countdown, then type for 60 seconds
3. Correct typing speeds the red bike; errors slow it
4. High streak + accuracy triggers a short nitro boost
5. Higher progress at 00:00 wins
