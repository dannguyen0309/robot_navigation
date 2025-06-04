from robot_navigation.backend.grid import load_grid
from robot_navigation.backend.algorithms import * 
from robot_navigation.backend.node import Node
from robot_navigation.backend.utils import manhattan_distance

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
    node, nodes_created = fringe_search(start, goals, walls, n, m)
    # node, nodes_created = a_star(start, goals, walls, n, m)

    if node:
        path_coords = [n.state for n in node.path()]
        for x, y in path_coords:
            if grid[y][x] == '.':
                grid[y][x] = '*'

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
def visualize_manhattan_distances_to_goals(filename):
    n, m, start, goals, walls = load_grid(filename)

    # Tạo một tập hợp các tọa độ tường để tra cứu nhanh
    wall_coords = set()
    for wx, wy, w, h in walls:
        for dy in range(h):
            for dx in range(w):
                x, y = wx + dx, wy + dy
                if 0 <= x < m and 0 <= y < n:
                    wall_coords.add((x, y))

    distance_grid_values = [[None for _ in range(m)] for _ in range(n)]
    max_distance = 0

    # Tính toán khoảng cách Manhattan từ mỗi ô đến mục tiêu gần nhất
    for y in range(n):
        for x in range(m):
            if (x, y) in wall_coords:
                distance_grid_values[y][x] = '#'
            else:
                min_distance = float('inf')
                for gx, gy in goals:
                    # Sử dụng hàm manhattan_distance từ utils
                    dist = manhattan_distance((x, y), (gx, gy))
                    min_distance = min(min_distance, dist)
                distance_grid_values[y][x] = min_distance
                # Cập nhật khoảng cách lớn nhất để định dạng hiển thị
                if min_distance != float('inf'):
                     max_distance = max(max_distance, min_distance)

    # Xác định độ rộng padding cần thiết để căn chỉnh các số khi in
    padding_width = len(str(max_distance)) if max_distance > 0 else 1

    print("\n--- Bản đồ khoảng cách Manhattan đến mục tiêu gần nhất ---")

    # In bản đồ khoảng cách
    for y in range(n):
        row_display = []
        for x in range(m):
            value = distance_grid_values[y][x]
            if value == '#':
                row_display.append('#'.ljust(padding_width))
            else:
                # Định dạng số và căn lề phải
                row_display.append(str(value).ljust(padding_width))
        print(' '.join(row_display))

    print("--------------------------------------------------------")
if __name__ == "__main__":
    filename = "test_cases/RobotNav-test.txt"
    print("--- Bản đồ đường đi ---")
    visualize_path(filename)
    visualize_manhattan_distances_to_goals(filename)
