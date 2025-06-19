import os
import random
from typing import List, Tuple
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware

from grid import parse_grid_from_text
from algorithms_for_app import (
    dfs_trace,
    bfs_trace,
    greedy_best_first_search_trace,
    a_star_trace,
    bi_directional_trace,
    fringe_search_trace
)

app = FastAPI(title = "Robot Navigation API")

origins = [
    "http://localhost:3000",  # React app running locally
    "https://robot-navigation.onrender.com",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

#-------- PARSE THE UPLOAD GRID TEXT -------------------
class ParseRequest(BaseModel):
    grid_text: str

class ParseResponse(BaseModel):
    n: int
    m: int
    start: Tuple[int, int]
    goals: List[Tuple[int, int]]
    walls: List[Tuple[int, int, int, int]]
#--------SOLVE THE UPLOAD GRID TEXT -------------------
class SolveRequest(BaseModel):
    grid_text: str
    algorithm: str

class SolveResponse(BaseModel):
    visited: List[List[Tuple[int, int]]]
    path: List[List[Tuple[int, int]]]
    nodes_created: List[int]
    n: int
    m: int
    start: Tuple[int, int]
    goals: List[Tuple[int, int]]
    walls: List[Tuple[int, int, int, int]]
    jumps: List[List[Tuple[int, int]]] = []

# --------------------------------------------------------------------------
@app.post("/parse", response_model=ParseResponse)
async def parse_grid(request: ParseRequest):
    try:
        n, m, start, goals, walls = parse_grid_from_text(request.grid_text)
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Invalid grid format: {e}")
    return ParseResponse(n=n, m=m, start=start, goals=goals, walls=walls)

# --------------------------------------------------------------------------
@app.post("/solve", response_model= SolveResponse)
async def solve (request: SolveRequest):
    try:
        n, m, start, goals, walls = parse_grid_from_text(request.grid_text)
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Invalid grid format: {e}")
    # FIND OTHER PATH 

    algo = request.algorithm.lower()
    all_paths = []
    all_visited = []
    all_nodes_created = []
    all_jumps = []
    current_start = start
    remaining_goals = goals.copy()

    while remaining_goals:
        current_goal = remaining_goals[0]
        if algo == "dfs":
            visited, path, nodes_created = dfs_trace(current_start, [current_goal], walls, n, m)
            jumps = []
        elif algo == "bfs":
            visited, path, nodes_created = bfs_trace(current_start, [current_goal], walls, n, m)
            jumps = []
        elif algo == "as":
            visited, path, nodes_created = a_star_trace(current_start, [current_goal], walls, n, m)
            jumps = []
        elif algo == "gbfs":
            visited, path, nodes_created = greedy_best_first_search_trace(current_start, [current_goal], walls, n, m)
            jumps = []
        elif algo == "bd": # Bi-directional (BD)
            visited, path, nodes_created = bi_directional_trace(current_start, [current_goal], walls, n, m)
            jumps = []
        elif algo == "fs": # Fringe Search (FS)
            visited, path, nodes_created, jumps = fringe_search_trace(current_start, [current_goal], walls, n, m, allow_jumps=True)
        else:
            raise HTTPException (status_code=400, detail=f"Unknown algorithm: {request.algorithm}")
        all_paths.append(path)
        all_visited.append(visited)
        all_nodes_created.append(nodes_created)
        all_jumps.append(jumps)
        # Update start and remove reached goal
        current_start = current_goal
        remaining_goals = [g for g in remaining_goals if g != current_start]

    return SolveResponse(visited = all_visited, path = all_paths, nodes_created = all_nodes_created, n = n, m = m, start = start, goals = goals, walls = walls, jumps = all_jumps)

# ---------------- RANDOM TEXT FILE ------------------------------------
@app.post("/randomize")
async def randomize_grid():
    base_dir = os.path.dirname(os.path.abspath(__file__))
    test_case_dir = os.path.join(base_dir, "test_cases")
    files = [f for f in os.listdir(test_case_dir) if f.endswith(".txt")]
    chosen_file = random.choice(files)
    with open(os.path.join(test_case_dir, chosen_file), "r") as f:
        grid_text = f.read()
    return {"filename": chosen_file, "grid_text": grid_text}