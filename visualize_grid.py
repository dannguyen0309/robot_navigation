from grid import load_grid
from search_algorithms import * 
from node import Node
from utils import manhattan_distance

def visualize_path(filename):
    n, m, start, goals, walls = load_grid(filename)

    # Khởi tạo grid trống
    grid = [['.' for _ in range(m)] for _ in range(n)]

    # Đặt walls
    for wx, wy, w, h in walls:
        for dy in range(h):
            for dx in range(w):
                x, y = wx + dx, wy + dy
                if 0 <= x < m and 0 <= y < n:
                    grid[y][x] = '#'

    # Chạy BFS (hoặc thuật toán khác)
    node, nodes_created = greedy_best_first_search(start, goals, walls, n, m)
    # node, nodes_created = a_star(start, goals, walls, n, m)

    if node:
        path_coords = [n.state for n in node.path()]
        for x, y in path_coords:
            if grid[y][x] == '.':
                d = min(manhattan_distance((x,y), goal) for goal in goals)
                grid[y][x] = str(d)

    # Đặt start
    sx, sy = start
    grid[sy][sx] = 'S'

    # Đặt goals
    for gx, gy in goals:
        if grid[gy][gx] == '.':
            grid[gy][gx] = 'G'
        elif grid[gy][gx] == 'S':
            grid[gy][gx] = 'S/G'

    # In grid
    for row in grid:
        print(' '.join(row))

if __name__ == "__main__":
    visualize_path("test_cases/new.txt")
