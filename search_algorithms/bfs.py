from state import State
from utils import *
def breadth_first_search (grid, start, goals, walls):
    # Start with a frontier that contains the initial state
    frontier = QueueFrontier()
    state_start = State(pos = start, path = [], g = 0)
    frontier.add(state_start)

    # Start with an empty explored set
    explored = set()
    
    # If frontier is NOT empty
    while not frontier.empty():
        # Remove current state (node) in frontier
        current_state = frontier.remove()

        # Checking node contains goal state return node
        if current_state.pos in goals:
            return current_state
        # Add node into set
        explored.add(current_state.pos)
        # Expand node, add resulting nodes to the frontier if they aren't already in the frontier or the explored set
        for next_successor in current_state.get_successors(grid, walls):
            in_explored = next_successor.pos in explored
            in_frontier = any(n.pos == next_successor.pos for n in frontier.frontier)

            if not in_explored and not in_frontier:
                frontier.add(next_successor)
    return None
            

