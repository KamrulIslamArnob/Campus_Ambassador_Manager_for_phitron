# Backend

Node.js + Express + MongoDB REST API

## Features
- Connects to MongoDB using Mongoose (see `src/config/db.config.js`)
- User model: `name`, `score`, `createdAt`
- REST API:
  - `GET /users` → returns all users sorted by `score` descending
  - `POST /users` → adds a new user with name and score
  - `PUT /users/:id` → updates a user's score
  - `DELETE /users/:id` → deletes a user

## Setup
1. Install dependencies:
   ```bash
   npm install
   ```
2. Create a `.env` file in the Backend directory:
   ```env
   MONGO_URI=mongodb://localhost:27017/campus_ambassador_manager
   ```
3. Start the server:
   ```bash
   npm run dev
   ```
   (This runs `src/server.js` using nodemon for development)

## Project Structure
- `src/config/db.config.js` — MongoDB connection logic
- `src/server.js` — Main server entry point
- `src/models/` — Mongoose models
- `src/controllers/` — Route controllers
- `src/routes/` — Express route definitions

## Dev Tools
- Uses `nodemon` for development 