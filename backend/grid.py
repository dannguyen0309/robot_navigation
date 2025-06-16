import ast

# PARSE GRID LINES
def parse_grid_lines(lines):
    if len(lines) < 3:
        raise ValueError("Grid text should have size, start, goal(s)")

    n, m = ast.literal_eval(lines[0])
    start = ast.literal_eval(lines[1])
    goals = [ast.literal_eval(g.strip()) for g in lines[2].split("|")]

    walls = []
    for line in lines[3:]:
        line = line.strip()
        if line:
            walls.append(ast.literal_eval(line))

    return n, m, start, goals, walls
# USE FOR CLI 
def load_grid(filename):
    with open(filename) as f:
        lines = f.read().splitlines()
    return parse_grid_lines(lines)
# USE FOR APP
def parse_grid_from_text(grid_text: str):
    lines = grid_text.splitlines()
    return parse_grid_lines(lines)


def is_valid (x, y, walls, n, m):
    if x < 0 or x >= m or y < 0 or y >= n:
        return False
    for wx, wy, w, h in walls:
        if wx <= x < wx + w and wy <= y < wy + h:
            return False
    return True 
def is_wall(x, y, walls):
    for wx, wy, ww, wh in walls:
        if wx <= x < wx + ww and wy <= y < wy + wh:
            return True
    return False
