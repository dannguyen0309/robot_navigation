from collections import deque
from node import Node
from grid import is_valid, is_wall
from utils import PriorityQueue, manhattan_distance

def expand(state, walls, n, m, allow_jumps=False, max_jump=3):
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

        # Jump moves
    if allow_jumps:
        for action, (next_x, next_y) in actions:
            dx = next_x - x
            dy = next_y - y
            for j in range(2, max_jump + 1):
                blocked = False
                for step in range(1, j):
                    xi = x + dx * step
                    yi = y + dy * step
                    if not is_wall(xi, yi, walls):
                        blocked = True
                        break
                jump_x = x + dx * j
                jump_y = y + dy * j
                if not blocked and is_valid(jump_x, jump_y, walls, n, m):
                    jump_action = f"jump_{action}{j}"
                    successors.append((jump_action, (jump_x, jump_y)))
    
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


# ----------------------- CUSTOM 1 - UNINFORMED SEARCH - Bi-directional
def bi_directional(start, goals, walls, n, m):
    fwd_queue = deque([Node(start)])
    bwd_queue = deque()

    fwd_explored = {start}
    bwd_explored = set()

    fwd_nodes = {start: fwd_queue[0]}
    bwd_nodes = {}

    for goal in goals:
        goal_node = Node(goal)

        bwd_queue.append(goal_node)
        bwd_explored.add(goal)
        bwd_nodes[goal] = goal_node
    
    nodes_created = 1 + len(goals)
    while fwd_queue and bwd_queue:
        # Forward search step
        current_node_fwd = fwd_queue.popleft()

        if current_node_fwd.state in bwd_explored:
            meeting_node_fwd = current_node_fwd
            meeting_node_bwd = bwd_nodes[current_node_fwd.state]
            return _stitch_paths(meeting_node_fwd, meeting_node_bwd), nodes_created
        
        for action, next_node in expand(current_node_fwd.state, walls, n, m):

            if next_node not in fwd_explored:
                child_node_fwd = Node(next_node,
                                    parent=current_node_fwd,
                                    action=action,
                                    path_cost=current_node_fwd.path_cost + 1)
                fwd_queue.append(child_node_fwd)
                fwd_explored.add(next_node)
                fwd_nodes[next_node] = child_node_fwd
                nodes_created += 1

                if next_node in bwd_explored:
                    meeting_node_fwd = child_node_fwd
                    meeting_node_bwd = bwd_nodes[next_node]
                    return _stitch_paths(meeting_node_fwd, meeting_node_bwd), nodes_created

        # Backward search step
        current_node_bwd = bwd_queue.popleft()

        if current_node_bwd.state in fwd_explored:
            meeting_node_fwd = fwd_nodes[current_node_bwd.state]
            meeting_node_bwd = current_node_bwd
            return _stitch_paths(meeting_node_fwd, meeting_node_bwd), nodes_created
        
        for action, next_node in expand(current_node_bwd.state, walls, n, m):
            if next_node not in bwd_explored:
                child_node_bwd = Node(next_node,
                                    parent=current_node_bwd,
                                    action=action,
                                    path_cost=current_node_bwd.path_cost + 1)
                bwd_queue.append(child_node_bwd)
                bwd_explored.add(next_node)
                bwd_nodes[next_node] = child_node_bwd
                nodes_created += 1

                if next_node in fwd_explored:
                    meeting_node_fwd = fwd_nodes[next_node]
                    meeting_node_bwd = child_node_bwd
                    return _stitch_paths(meeting_node_fwd, meeting_node_bwd), nodes_created

    return None, nodes_created

def _stitch_paths(fwd_meet_node, bwd_meet_node):
    REVERSE_ACTIONS_MAP = {'up': 'down', 'down': 'up', 'left': 'right', 'right': 'left'}

    # Step 1: Initialize
    current_stitched_node = fwd_meet_node

    # Step 2: Reconstruct path from goal (backward search) up to the meeting node
    path_from_bwd_goal_to_meet_nodes = []
    current_bwd_path_node = bwd_meet_node

    while current_bwd_path_node is not None:
        path_from_bwd_goal_to_meet_nodes.insert(0, current_bwd_path_node)  # Insert at head
        current_bwd_path_node = current_bwd_path_node.parent

    # Step 3: Stitch the backward path into the forward path
    # Skip the meeting node itself (index -1), start from parent of bwd_meet_node
    for i in range(len(path_from_bwd_goal_to_meet_nodes) - 2, -1, -1):
        node_to_get_state_from = path_from_bwd_goal_to_meet_nodes[i]
        child_node_in_bwd_path_segment = path_from_bwd_goal_to_meet_nodes[i + 1]

        # Action in the backward search that reached the child
        action_in_bwd_tree = child_node_in_bwd_path_segment.action
        # Reverse the action to align with the overall path direction
        action_for_stitched_path = REVERSE_ACTIONS_MAP[action_in_bwd_tree]

        new_path_cost = current_stitched_node.path_cost + 1  # assuming step cost of 1

        new_stitched_node = Node(
            state=node_to_get_state_from.state,
            parent=current_stitched_node,
            action=action_for_stitched_path,
            path_cost=new_path_cost
        )

        current_stitched_node = new_stitched_node

    # Step 4: Return the final stitched node
    return current_stitched_node
# ----------------------- CUSTOM 2 - INFORMED SEARCH - FRINGE SEARCH ---------------------
def fringe_search(start, goals, walls, n, m, weight=1.2, threshold_delta=0.0):
    start_h = min(manhattan_distance(start, goal) for goal in goals)
    start_node = Node(start, path_cost=0, heuristic=start_h)

    # Initialize
    current = [start_node]
    later = []
    threshold = start_node.path_cost + weight * start_node.heuristic
    nodes_created = 1
    cost_so_far = {start: 0}
    explored_states_list = [start_node]

    while current:
        min_f_exceeding_threshold = float('inf')

        for node in current:
            if node.state in goals:
                return node, nodes_created

            for action, next_node in expand(node.state, walls, n, m, allow_jumps=True, max_jump=3):
                if "jump_" in action:
                    n_jump = int(''.join(filter(str.isdigit, action)))  
                    step_cost = 2 ** (n_jump - 1)
                else:
                    step_cost = 1

                new_cost = node.path_cost + step_cost

                # Only expand if new_cost is better than any previous cost
                if next_node not in cost_so_far or new_cost < cost_so_far[next_node]:
                    cost_so_far[next_node] = new_cost
                    h = min(manhattan_distance(next_node, goal) for goal in goals)
                    f = new_cost + weight * h
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

        if not later:
            return None, nodes_created

        # Prune later: keep only the best node per state
        next_later = {}
        for node in later:
            if node.state not in next_later or node.path_cost < next_later[node.state].path_cost:
                next_later[node.state] = node
        current = sorted(next_later.values(), key=lambda n: n.path_cost + weight * n.heuristic)
        later = []

    return None, nodes_created