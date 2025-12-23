# Kanban Backend (MongoDB + Express)

This backend provides CRUD APIs for lists and cards, persisting to MongoDB.

## Endpoints

- `GET /api/board` — fetch all lists and cards
- `DELETE /api/board/reset` — clear all data
- `POST /api/lists` — create list
- `PATCH /api/lists/:id` — update list
- `DELETE /api/lists/:id` — delete list (+ its cards)
- `POST /api/cards` — create card
- `PATCH /api/cards/:id` — update card
- `DELETE /api/cards/:id` — delete card
- `POST /api/cards/:id/move` — move card to a list/index

## Setup

1. Install dependencies

```powershell
cd backend
npm install
```

2. Configure environment

- Copy `.env.example` to `.env` and update `MONGODB_URI`

3. Run the server

```powershell
npm run dev
# or
npm start
```

Server defaults to port `5000`. Health check: `GET /health`.
