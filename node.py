class Node:
    def __init__ (self, state, parent = None, action = None, path_cost = 0, heuristic = 0):
        self.state = state
        self.parent = parent
        self.action = action
        self.path_cost = path_cost
        self.heuristic = heuristic
            
    def path(self):
        goal_node, path_back = self, []
        while  goal_node != None:
            path_back.append(goal_node)
            goal_node = goal_node.parent
         
        return list(reversed(path_back))
    
    def solution(self):
        actions =[]
        node = self
        while node.parent is not None:
            actions.append(node.action.lower())
            node = node.parent
        return list(reversed(actions))


    def __lt__(self, other):
        return (self.path_cost + self.heuristic) <  (other.path_cost + other.heuristic)
    
    
