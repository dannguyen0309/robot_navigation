from collections import deque
from node import Node
from grid import is_valid
from utils import PriorityQueue, manhattan_distance, euclidean_distance

def expand(state, walls, n, m):
    x, y = state
    actions = [
        ('up', (x, y-1)),
        ('left', (x-1, y)),
        ('down', (x, y+1)),
        ('right', (x+1, y))
    ]
    successors = []
    
    for action, (next_x, next_y) in actions:
        if is_valid(next_x, next_y, walls, n, m):
            successors.append((action, (next_x, next_y)))
    
    return successors

def depth_first_search (start, goals, walls, n, m):
    stack = [Node(start)]
    explored = set()
    nodes_created = 1
    
    while stack:
        node = stack.pop()
        if node.state in goals:
            return node, nodes_created
        
        explored.add(node.state)

        for action, next_node in expand(node.state, walls, n, m):
            if next_node not in explored:
                child_node = Node(next_node, 
                                  parent = node, 
                                  action = action, 
                                  path_cost = node.path_cost+1)
                stack.append(child_node)
                nodes_created += 1
    
    return None, nodes_created

def breadth_first_search (start, goals, walls, n, m):
    queue = deque([Node(start)])
    explored = set()
    nodes_created = 1

    while queue:
        node = queue.popleft()
        if node.state in goals:
            return node, nodes_created
        
        explored.add(node.state)

        for action, next_node in expand(node.state, walls, n, m):
            if next_node not in explored:
                child_node = Node(next_node, 
                                  parent = node, 
                                  action = action, 
                                  path_cost = node.path_cost + 1)
                queue.append(child_node)
                explored.add(next_node)
                nodes_created += 1
    
    return None, nodes_created

def greedy_best_first_search (start, goals, walls, n, m):
    start_h = min(manhattan_distance(start, goal) for goal in goals)    
    start_node = Node(start, heuristic = start_h)
    frontier = PriorityQueue(order='min', f = lambda node : node.heuristic)
    explored = set()
    nodes_created = 1
    frontier.append(start_node)

    while frontier:
        node = frontier.pop()
        if node.state in goals:
            return node, nodes_created
        
        explored.add(node.state)

        for action, next_node in expand(node.state, walls, n, m):
            if next_node not in explored:
                h = min(manhattan_distance(next_node, goal) for goal in goals)
                child_node = Node(next_node, 
                                  parent = node, 
                                  action = action, 
                                  path_cost = node.path_cost + 1,
                                  heuristic = h)
                frontier.append(child_node)
                nodes_created += 1
    return None, nodes_created

def a_star (start, goals, walls, n, m):
    start_h = min(manhattan_distance(start, goal) for goal in goals)
    start_node = Node(start, heuristic = start_h)
    frontier = PriorityQueue (order='min', f = lambda node : node.heuristic + node.path_cost)
    frontier.append(start_node)

    cost_so_far = {start: 0}
    nodes_explored = 1

    while frontier:
        node = frontier.pop()
        if node.state in goals:
            return node, nodes_explored
        
        for action, next_node in expand(node.state, walls, n, m):
            new_cost = node.path_cost + 1
            if next_node not in cost_so_far or new_cost < cost_so_far[next_node]:
                cost_so_far[next_node] = new_cost
                h = min(manhattan_distance(next_node, goal) for goal in goals)
                child_node = Node(next_node, 
                                  parent = node,
                                  action = action, 
                                  path_cost = new_cost, 
                                  heuristic = h)
                frontier.append(child_node)
                nodes_explored += 1
    return None, nodes_explored





# ----------------------- CUSTOM 2 - UNINFORMED SEARCH - FRINGE SEARCH ---------------------
def fringe_search(start, goals, walls, n, m):
    start_h = min(manhattan_distance(start, goal) for goal in goals)
    start_node = Node(start, path_cost=0, heuristic=start_h)

    # Initialize
    current = [start_node]
    later = []
    threshold = start_node.path_cost + start_node.heuristic
    nodes_created = 1
    cost_so_far = {start: 0}
    explored_states_list = []

    explored_states_list.append(start_node)
    while current:
        min_f_exceeding_threshold = float('inf')

        for node in current:
            if node.state in goals:
                return node, nodes_created

            for action, next_node in expand(node.state, walls, n, m):
                step_cost = 1  
                new_cost = node.path_cost + step_cost
                h = min(manhattan_distance(next_node, goal) for goal in goals)
                f = new_cost + h

                if next_node not in cost_so_far or new_cost < cost_so_far[next_node]:
                    cost_so_far[next_node] = new_cost
                    child_node = Node(next_node, 
                                      parent=node, 
                                      action=action,
                                      path_cost=new_cost, 
                                      heuristic=h)
                    nodes_created += 1

                    if f <= threshold:
                        later.append(child_node)
                    else:
                        min_f_exceeding_threshold = min(min_f_exceeding_threshold, f)
                        later.append(child_node)

        if not later:
            return None, nodes_created

        threshold = min_f_exceeding_threshold
        current = later
        later = []

    return None, nodes_created


