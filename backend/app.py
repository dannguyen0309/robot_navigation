from typing import List, Optional, Tuple
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, Field
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

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class SolveRequest(BaseModel):
    grid_text: str
    algorithm: str

class SolveResponse(BaseModel):
    visited: List[Tuple[int, int]]
    path: List[Tuple[int, int]]
    nodes_created: int

@app.post("/solve", response_model= SolveResponse)
async def solve (request: SolveRequest):
    try:
        n, m, start, goals, walls = parse_grid_from_text(request.grid_text)
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Invalid grid format: {e}")
    
    algo = request.algorithm.lower()

    if algo == "dfs":
        visited, path, nodes_created = dfs_trace(start, goals, walls, n, m)
    elif algo == "bfs":
        visited, path, nodes_created = bfs_trace(start, goals, walls, n, m)
    elif algo == "as":
        visited, path, nodes_created = a_star_trace(start, goals, walls, n, m)
    elif algo == "gbfs":
        visited, path, nodes_created = greedy_best_first_search_trace(start, goals, walls, n, m)
    elif algo == "bd": # Bi-directional (BD)
        visited, path, nodes_created = bi_directional_trace(start, goals, walls, n, m)
    elif algo == "fs": # Fringe Search (FS)
        visited, path, nodes_created = fringe_search_trace(start, goals, walls, n, m)       
    else:
        raise HTTPException (status_code=400, detail=f"Unknown algorithm: {request.algorithm}")
    
    return SolveResponse(visited = visited, path = path, nodes_created = nodes_created)