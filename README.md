# Task Tracker Lite - Full Stack (MySQL + Node + React)

This repository contains a full-stack implementation for the Task Tracker Lite assignment.

Services:
- MySQL (docker)
- Backend: Node.js + Express + Sequelize (MySQL)
- Frontend: React (development server)

Run:
1. Copy `backend/.env.example` to `backend/.env` and adjust if needed.
2. Run `docker-compose up --build`
3. Frontend: http://localhost:3000
   Backend API: http://localhost:5000

Seed admin:
- After backend is up, exec into backend container and run `npm run seed` or run the seed script locally.

Assignment PDF used: /mnt/data/Sharp And Tannan Task for Full Stack Developer.pdf
