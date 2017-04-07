import reducer from './nodes';

describe('Having a list of two nodes', () => {
  let nodes;
  beforeEach(() => {
    nodes = [
      { id: 1 },
      { id: 2 },
    ];
  });

  it('moving down should select first node', () => {
    const newNodes = reducer(nodes, { type: 'move_down' });
    expect(newNodes[0].isSelected).toEqual(true);
  });

  describe('with two childs in first node with first subchild is selected', () => {
    beforeEach(() => {
      nodes[0].child = [
        { id: 3, isSelected: true },
        { id: 4 },
      ];
    });

    it('moving down should unselect 1.1 and select 1.2', () => {
      const newNodes = reducer(nodes, { type: 'move_down' })
      expect(newNodes[0].child[0].isSelected).toBeFalsy();
      expect(newNodes[0].child[1].isSelected).toBeTruthy();
    });
  });

  describe('first nodes with two childs and hidden', () => {
    beforeEach(() => {
      nodes[0].child = [{ id: 3 }, { id: 4 }];
      nodes[0].isSelected = true;
      nodes[0].isHidden = true;
    });

    it('should skip subchilds and select second root node', () => {
      const newNodes = reducer(nodes, { type: 'move_down' });
      expect(newNodes[0].isSelected).toEqual(false);
      expect(newNodes[1].isSelected).toEqual(true);

    });
  });
});

