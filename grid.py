import sys
import ast

def load_grid(filename):
    with open(filename) as f:
        lines = f.read().splitlines()

        #GRID
        grid_line = lines[0].strip()
        grid_size = ast.literal_eval(grid_line)
        row, column = grid_size

        #START
        start_line = lines[1].strip()
        start = ast.literal_eval(start_line)

        #GOAL
        goal_line = lines[2].strip()
        if "|" in goal_line:
            parts = goal_line.split("|")
            goals = []
            for p in parts:
                goals.append(ast.literal_eval(p))
        else:
            goals = [ast.literal_eval(goal_line)]
        
        # WALLS
        walls = []
        for line in lines[3:]:
            wall_line = line.strip()
            wall_data = ast.literal_eval(wall_line)
            walls.append(wall_data)

        # GRID 
        grid = []

        for _ in range(row):
            row_cells = []
            for _ in range (column):
                row_cells.append(False)
            grid.append(row_cells)
        
        # ADD WALL INTO GRID
        wall_cells = []

        for x,y,w,h in walls:
            for dy in range (h): # h: no. of rows (vertical)
                for dx in range (w): # w: no. of columns (horizontal)
                    cell_x = x + dx
                    cell_y = y + dy
                    wall_cells.append((cell_x, cell_y))
        
        for x, y in wall_cells:
            grid[y][x] = True
        
    return grid, start, goals, wall_cells 

def is_valid (x,y,grid, wall_cells):
    rows = len(grid)
    cols = len(grid[0])

    if x < 0 or x >= cols or y < 0 or y >= rows:
        return False
    if (x,y) in wall_cells:
        return False
    return True

"""
def print_grid(grid, start, goals):
    for y, row in enumerate(grid):
        line = ''
        for x, cell in enumerate(row):
            if (x, y) == start:
                line += 'A'
            elif (x, y) in goals:
                line += 'B'
            elif cell:
                line += '#'
            else:
                line += '.'
        print(line)

grid, start, goals, walls = load_grid(filename)
print_grid(grid, start, goals)
"""
