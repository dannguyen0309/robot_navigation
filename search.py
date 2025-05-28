import sys
from grid import load_grid
from search_algorithms import *

if __name__ == "__main__":
    filename, method = sys.argv[1], sys.argv[2]

    n, m, start, goals, walls = load_grid(filename)

    if method == "DFS" or method == "dfs":
        node, nodes_created = depth_first_search(start, goals, walls, n, m)
    elif method == "BFS" or method == "bfs":
        node, nodes_created = breadth_first_search(start, goals, walls, n, m)
    elif method == "GBFS" or method == "gbfs":
        node, nodes_created = greedy_best_first_search(start, goals, walls, n, m)
    elif method == "AS" or method == "as":
        node, nodes_created = a_star(start, goals, walls, n, m)
    else:
        print("Unknown method:", method)
        exit()

    print(filename, method)

    if node:
        print(node.state, nodes_created)
        print(node.solution())
    else:
        print("No goal is reachable;", nodes_created)
