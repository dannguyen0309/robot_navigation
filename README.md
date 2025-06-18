# 🤖 Robot Navigation Visualizer

A pathfinding visualizer that demonstrates classic search algorithms like **DFS**, **BFS**, **Greedy Best-First Search**, **A\***, **Bi-Directional**, and **Jump Fringe Search** — with a modern user interface powered by **React + TypeScript** and a **FastAPI** backend.

You can run it locally, use the CLI, or try it online via the deployed web app.

---

## 🔗 Live Demo

Explore the visualizer here:  
👉 [https://robot-navigation-one.vercel.app](https://robot-navigation-one.vercel.app)

- ✅ **Frontend** hosted on Vercel  
- ✅ **Backend** deployed via Render

---

## ⚙️ Local Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/robot-navigation.git
cd robot-navigation
```
## 🖥️ Running Locally (Frontend + Backend)

### ✅ Backend (FastAPI) 

In one terminal:
```bash
cd backend
pip install -r requirements.txt
uvicorn app:app --reload --port 8000
```

### ✅ Frontend (Next.js)

In second terminal:
```bash
cd frontend
npm install
npm run dev
```
Open your browser and go to: [http://localhost:3000]

---

## Run Via CLI

You can also execute search algorithms directly using the command line interface.

### 📌 Syntax:

```bash
cd backend
python search.py .\test_cases\<filename> <method>
```
filename = your test case file (e.g., test1.txt)
method = algorithm name (e.g., dfs, bfs, astar)

### 🧪 Example:

```bash
cd backend
python search.py .\test_cases\grid_1.txt astar
```

---

## 📄 License

This project is licensed under the MIT License.
Feel free to fork and build upon it!

---

Let me know your GitHub repo link if you'd like me to insert it into the clone command (`git clone ...`). I can also help you add algorithm documentation or test case guidelines if needed.
