# News API Backend

A Node.js + TypeScript backend for a news media platform. Features JWT authentication, MongoDB storage, and integration with NewsAPI.org.

## Features
- User registration and login (JWT)
- CRUD for news articles
- Fetch news from NewsAPI.org
- MongoDB for persistent storage

## Setup
1. Install dependencies:
   ```sh
   npm install
   ```
2. Create a `.env` file with:
   ```env
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/newsdb
   JWT_SECRET=your_jwt_secret
   NEWS_API_KEY=your_newsapi_key
   ```
3. Run in development mode:
   ```sh
   npm run dev
   ```

## Scripts
- `npm run dev` — Start in dev mode (nodemon)
- `npm run build` — Build TypeScript
- `npm start` — Run built server 