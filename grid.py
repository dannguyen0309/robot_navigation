import ast

def load_grid(filename):
    with open(filename) as f:
        lines = f.read().splitlines()

    #GRID SIZE (NxM)
    n, m = ast.literal_eval(lines[0])

    #START
    start = ast.literal_eval(lines[1])

    #GOAL
    goals = [ast.literal_eval(goal.strip()) for goal in lines[2].split("|")]
    
    # WALLS
    walls = []
    for line in lines[3:]:
        wall = ast.literal_eval(line.strip())
        walls.append(wall)

    return n, m, start, goals, walls

def is_valid (x, y, walls, n, m):
    if x < 0 or x >= m or y < 0 or y >= n:
        return False
    for wx, wy, w, h in walls:
        if wx <= x < wx + w and wy <= y < wy + h:
            return False
    return True 