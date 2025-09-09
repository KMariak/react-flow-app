# React Flow App + FastAPI + MongoDB

A visual workflow builder (sequence editor) with persistent storage in MongoDB.

## Tech Stack
- **Frontend:** React + Vite + [React Flow](https://reactflow.dev)
- **Backend:** FastAPI (Python)
- **Database:** MongoDB
- **Dev Setup:** Docker (Mongo), Uvicorn (FastAPI), Vite dev server

## Project Structure

react-flow-app/
├── my-react-flow-app/        # frontend (React + Vite)
│   ├── src/
│   │   ├── App.jsx           # main application component
│   │   ├── Toolbar.jsx       # toolbar with buttons to add nodes
│   │   ├── FlowPillNode.jsx  # custom node renderer (Start, End, Message, Delay, Check, Split)
│   │   ├── FlowManagerModal.jsx # modal for saving/loading flows
│   │   ├── api.js            # API client for backend
│   │   └── …
│   ├── package.json
│   └── .env                  # VITE_API_URL=http://localhost:8000
└── backend/
├── app/
│   └── main.py           # FastAPI CRUD for flows
└── requirements.txt


### 1. Start MongoDB (Docker)
```bash
docker run -d --name mongo -p 27017:27017 mongo:7
```

### 2. Start MongoDB (Docker)
```bash
cd backend
uvicorn app.main:app --reload --port 8000
```
Docs available at: http://localhost:8000/docs


### 3. Frontend (Vite)
```bash
cd my-react-flow-app
npm install
npm run dev
```
Open: http://localhost:5173