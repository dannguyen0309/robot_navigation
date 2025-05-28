from collections import deque
from node import Node
from grid import is_valid
from utils import PriorityQueue, manhattan_distance

def expand(state, walls, n, m):
    x, y = state
    actions = [
        ('UP', (x, y-1)),
        ('LEFT', (x-1, y)),
        ('DOWN', (x, y+1)),
        ('RIGHT', (x+1, y))
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
    explored = set()
    nodes_explored = 1

    while frontier:
        node = frontier.pop()
        if node.state in goals:
            return node, nodes_explored
        
        explored.add(node.state)

        for action, next_node in expand(node.state, walls, n, m):
            if next_node not in explored:
                h = min(manhattan_distance(next_node, goal) for goal in goals)
                child_node = Node(next_node, 
                                  parent = node, 
                                  path_cost = node.path_cost + 1, 
                                  heuristic = h)
                frontier.append(child_node)
                nodes_explored += 1
    return None, nodes_explored






