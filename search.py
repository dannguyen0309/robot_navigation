import sys
from grid import load_grid
from algorithms import *

def multi_goals_search (start, goals, walls, n, m, search_method, filename, method):
    current_start = start
    remaining_goals = goals.copy() 
    while remaining_goals:
        node, nodes_created = search_method(current_start, remaining_goals, walls, n, m)
        if not node:
            print("Cannot find any path to:", remaining_goals)
            break

        print(filename, method)
        print(node.state, nodes_created)
        print(node.solution())

        current_start = node.state
        remaining_goals.remove(current_start)

if __name__ == "__main__":
    if len(sys.argv) != 3:
        print("Usage: python search.py <filename> <search method>")

    filename, method = sys.argv[1], sys.argv[2]

    n, m, start, goals, walls = load_grid(filename)

    search_method = {
        "dfs": depth_first_search,
        "bfs": breadth_first_search,
        "gbfs": greedy_best_first_search,
        "as": a_star,
        "bd": bi_directional,
        "fs": fringe_search
    }
 
    if method.lower() in search_method.keys():
        multi_goals_search(start, goals, walls, n, m, search_method[method], filename, method)
    else:
        print("Unknown method:", method)
        exit()