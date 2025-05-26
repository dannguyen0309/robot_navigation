from grid import load_grid, is_valid
from utils import *

class State:
    def __init__(self, pos, path = None, g = 0, h = 0):
        self.pos = pos
        self.path = path if path else []
        self.g = g 
        self.h = h
    
    def f(self):
        return self.g + self.h
    
    def get_successors(self, grid, walls):
        successors = []
        moves = [("UP", (0,-1)), ("DOWN", (0,1)), ("LEFT", (-1,0)), ("RIGHT", (1,0))]

        for action, (dx, dy) in moves:
            new_x = self.pos[0] + dx
            new_y = self.pos[1] + dy

            if is_valid(new_x, new_y, grid, walls):
              new_state = State( pos = (new_x, new_y),
                                path = self.path + [action],
                                g = self.g + 1,
                                h = 0)
              successors.append(new_state)

        return successors
    
    def __repr__(self):
        return f"State(pos={self.pos}, g={self.g}, h={self.h}, path={self.path})"



