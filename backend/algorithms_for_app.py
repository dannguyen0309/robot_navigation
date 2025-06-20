from collections import deque
from typing import List, Tuple, Dict
from algorithms import expand
from node import Node
from utils import PriorityQueue, manhattan_distance

def dfs_trace(
    start: Tuple[int,int],
    goals: List[Tuple[int,int]],
    walls: List[Tuple[int,int,int,int]],
    n: int,
    m: int,
) -> Tuple[List[Tuple[int,int]], List[Tuple[int,int]], int]:
    stack = [Node(start)]
    explored = set()
    visited_steps: List[Tuple[int,int]] = []
    nodes_created = 1
    found_node = None

    while stack:
        node = stack.pop()
        explored.add(node.state)
        visited_steps.append(node.state)

        if node.state in goals:
            found_node = node
            break

        successors = []
        for action, next_state in expand(node.state, walls, n, m):
            if next_state not in explored:
                successors.append((action, next_state))

        for action, next_state in reversed(successors):
            child = Node(next_state, parent=node, action=action, path_cost=node.path_cost + 1)
            stack.append(child)
            nodes_created += 1

    if not found_node:
        return visited_steps, [], nodes_created

    path_nodes = found_node.path()
    path_steps = [nd.state for nd in path_nodes]
    return visited_steps, path_steps, nodes_created


def bfs_trace(
    start: Tuple[int,int],
    goals: List[Tuple[int,int]],
    walls: List[Tuple[int,int,int,int]],
    n: int,
    m: int,
) -> Tuple[List[Tuple[int,int]], List[Tuple[int,int]], int]:
    queue = deque([Node(start)])
    explored = set()
    visited_steps: List[Tuple[int,int]] = []
    nodes_created = 1
    found_node = None

    while queue:
        node = queue.popleft()
        explored.add(node.state)
        visited_steps.append(node.state)   # CHÈN: mỗi lần pop, ghi lại state

        if node.state in goals:
            found_node = node
            break

        for action, next_state in expand(node.state, walls, n, m):
            if next_state not in explored:
                child = Node(next_state, parent=node, action=action, path_cost=node.path_cost + 1)
                queue.append(child)
                explored.add(next_state)
                nodes_created += 1

    if not found_node:
        return visited_steps, [], nodes_created

    path_nodes = found_node.path()
    path_steps = [nd.state for nd in path_nodes]
    return visited_steps, path_steps, nodes_created

def greedy_best_first_search_trace(
    start: Tuple[int,int],
    goals: List[Tuple[int,int]],
    walls: List[Tuple[int,int,int,int]],
    n: int,
    m: int,
) -> Tuple[List[Tuple[int,int]], List[Tuple[int,int]], int]:

    visited_steps: List[Tuple[int,int]] = []
    path_steps: List[Tuple[int,int]] = []
    nodes_created = 1
    found_node = None

    start_h = min(manhattan_distance(start, goal) for goal in goals)    
    start_node = Node(start, heuristic = start_h)

    frontier = PriorityQueue(order='min', f = lambda node : node.heuristic)
    frontier.append(start_node)

    explored = set()

    while frontier:
        node = frontier.pop()
        visited_steps.append(node.state)
        if node.state in goals:
            found_node = node
            break
        
        explored.add(node.state)

        for action, next_state in expand(node.state, walls, n, m):
            if next_state not in explored:
                h = min(manhattan_distance(next_state, goal) for goal in goals)
                child_node = Node(next_state, 
                                  parent = node, 
                                  action = action, 
                                  path_cost = node.path_cost + 1,
                                  heuristic = h)
                frontier.append(child_node)
                nodes_created += 1
    if not found_node:
        return visited_steps, [], nodes_created

    path_nodes = found_node.path()
    path_steps = [nd.state for nd in path_nodes]
    return visited_steps, path_steps, nodes_created

def a_star_trace(
    start: Tuple[int,int],
    goals: List[Tuple[int,int]],
    walls: List[Tuple[int,int,int,int]],
    n: int,
    m: int,
) -> Tuple[List[Tuple[int,int]], List[Tuple[int,int]], int]:

    visited_steps: List[Tuple[int,int]] = []
    path_steps: List[Tuple[int,int]] = []
    nodes_created = 1
    found_node = None

    start_h =  min(manhattan_distance(start, goal) for goal in goals)
    start_node = Node(start, heuristic=start_h)

    frontier = PriorityQueue(order='min', f=lambda node: node.path_cost + node.heuristic)
    frontier.append(start_node)

    cost_so_far: Dict[Tuple[int,int], int] = {start: 0}

    while frontier:
        node = frontier.pop()
        visited_steps.append(node.state) 
        if node.state in goals:
            found_node = node
            break

        for action, next_state in expand(node.state, walls, n, m):
            new_cost = node.path_cost + 1
            if next_state not in cost_so_far or new_cost < cost_so_far[next_state]:
                cost_so_far[next_state] = new_cost
                h = min(manhattan_distance(next_state, goal) for goal in goals)
                child_node = Node(next_state, parent=node, action=action, path_cost=new_cost, heuristic=h)
                frontier.append(child_node)
                nodes_created += 1

    if not found_node:
        return visited_steps, [], nodes_created

    path_nodes = found_node.path()
    path_steps = [nd.state for nd in path_nodes]
    return visited_steps, path_steps, nodes_created


# ----------------------- CUSTOM 1 - UNINFORMED SEARCH - Bi-directional (trace)-------------------
def bi_directional_trace(
    start: Tuple[int,int],
    goals: List[Tuple[int,int]],
    walls: List[Tuple[int,int,int,int]],
    n: int, 
    m: int
) -> Tuple[List[Tuple[int,int]], List[Tuple[int,int]], int]:
    # Declare frontier for forward and backward
    fwd_queue = deque([Node(start)])
    bwd_queue = deque()

    fwd_explored = {start}
    bwd_explored = set()

    fwd_nodes: Dict[Tuple[int,int], Node] = {start: fwd_queue[0]}
    bwd_nodes: Dict[Tuple[int,int], Node] = {}

    for g in goals:
        goal_node = Node(g)
        bwd_queue.append(goal_node)
        bwd_explored.add(g)
        bwd_nodes[g] = goal_node

    visited_steps: List[Tuple[int,int]] = []
    nodes_created = 1 + len(goals)  

    found_fwd = None  
    found_bwd = None  

    while fwd_queue and bwd_queue:
        # --- Forward step ---
        current_fwd = fwd_queue.popleft()
        visited_steps.append(current_fwd.state)

        if current_fwd.state in bwd_explored:
            found_fwd = current_fwd
            found_bwd = bwd_nodes[current_fwd.state]
            break

        for action, next_state in expand(current_fwd.state, walls, n, m):
            if next_state not in fwd_explored:
                child_fwd = Node(next_state,
                                 parent=current_fwd,
                                 action=action,
                                 path_cost=current_fwd.path_cost + 1)
                fwd_queue.append(child_fwd)
                fwd_explored.add(next_state)
                fwd_nodes[next_state] = child_fwd
                nodes_created += 1

                if next_state in bwd_explored:
                    found_fwd = child_fwd
                    found_bwd = bwd_nodes[next_state]
                    break
        if found_fwd:
            break

        # --- Backward step ---
        current_bwd = bwd_queue.popleft()
        visited_steps.append(current_bwd.state)

        if current_bwd.state in fwd_explored:
            found_fwd = fwd_nodes[current_bwd.state]
            found_bwd = current_bwd
            break

        for action, next_state in expand(current_bwd.state, walls, n, m):
            if next_state not in bwd_explored:
                child_bwd = Node(next_state,
                                 parent=current_bwd,
                                 action=action,
                                 path_cost=current_bwd.path_cost + 1)
                bwd_queue.append(child_bwd)
                bwd_explored.add(next_state)
                bwd_nodes[next_state] = child_bwd
                nodes_created += 1

                if next_state in fwd_explored:
                    found_fwd = fwd_nodes[next_state]
                    found_bwd = child_bwd
                    break
        if found_fwd:
            break

    # No meeting point
    if not found_fwd:
        return visited_steps, [], nodes_created

    # Correct path stitching: concatenate forward and reversed backward path (excluding meeting node)
    fwd_path = found_fwd.path()  # from start to meeting
    bwd_path = found_bwd.path()  # from goal to meeting
    bwd_path = bwd_path[::-1]    # reverse to go from meeting to goal
    # Remove the meeting node from bwd_path to avoid duplication
    if bwd_path and fwd_path and bwd_path[0].state == fwd_path[-1].state:
        bwd_path = bwd_path[1:]
    path_nodes = fwd_path + bwd_path
    path_steps = [nd.state for nd in path_nodes]
    return visited_steps, path_steps, nodes_created


# ---------------- CUSTOM 1 - INFORMED SEARCH - Fringe Search (trace) ----------------
def fringe_search_trace(
    start: Tuple[int, int],
    goals: List[Tuple[int, int]],
    walls: List[Tuple[int, int, int, int]],
    n: int,
    m: int,
    allow_jumps: bool = False,
    max_jump: int = 3,
    weight: float = 1.2,
    threshold_delta: float = 0.0
) -> Tuple[List[Tuple[int, int]], List[Tuple[int, int]], int, List[Tuple[int, int]]]:

    visited_steps: List[Tuple[int, int]] = []
    path_steps: List[Tuple[int, int]] = []
    jumps = set()
    nodes_created = 1

    # Use manhattan_distance for heuristic
    start_h = min(manhattan_distance(start, goal) for goal in goals)
    start_node = Node(start, path_cost=0, heuristic=start_h)

    current: List[Node] = [start_node]
    later: List[Node] = []
    threshold = start_node.path_cost + weight * start_node.heuristic
    cost_so_far: Dict[Tuple[int, int], int] = {start: 0}

    while current:
        min_f_over = float('inf')

        for node in current:
            visited_steps.append(node.state)

            if node.state in goals:
                path_steps = [n.state for n in node.path()]
                return visited_steps, path_steps, nodes_created, list(jumps)

            for action, next_state in expand(node.state, walls, n, m, allow_jumps=allow_jumps, max_jump=max_jump):
                if "jump_" in action:
                    jump_n = int(''.join(filter(str.isdigit, action)))
                    step_cost = 2 ** (jump_n - 1)
                else:
                    step_cost = 1

                new_cost = node.path_cost + step_cost
                if next_state not in cost_so_far or new_cost < cost_so_far[next_state]:
                    cost_so_far[next_state] = new_cost
                    h = min(manhattan_distance(next_state, goal) for goal in goals)
                    f_val = new_cost + weight * h
                    child = Node(
                        next_state,
                        parent=node,
                        action=action,
                        path_cost=new_cost,
                        heuristic=h
                    )
                    nodes_created += 1
                    if f_val <= threshold:
                        later.append(child)
                    else:
                        min_f_over = min(min_f_over, f_val)
        if not later:
            return visited_steps, [], nodes_created, list(jumps)
        # Prune later: keep only the best node per state
        next_later = {}
        for node in later:
            if node.state not in next_later or node.path_cost < next_later[node.state].path_cost:
                next_later[node.state] = node
        current = sorted(next_later.values(), key=lambda n: n.path_cost + weight * n.heuristic)
        later = []
        threshold = min_f_over + threshold_delta
    return visited_steps, path_steps, nodes_created, list(jumps)
