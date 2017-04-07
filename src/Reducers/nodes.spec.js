import reducer from './nodes';
let id = 1;
const node = () => ({ id: id++ });
const twoNodes = () => [node(), node()];

describe('Having a list of two nodes', () => {
  let nodes;
  beforeEach(() => {
    nodes = twoNodes();
  });

  it('moving down should select first node', () => {
    const newNodes = reducer(nodes, { type: 'move_down' });
    expect(newNodes[0].isSelected).toEqual(true);
  });

  describe('with two childs in first node with first subchild is selected', () => {
    beforeEach(() => {
      nodes[0].child = twoNodes();
      nodes[0].child[0].isSelected = true;
    });

    it('moving down should unselect 1.1 and select 1.2', () => {
      const newNodes = reducer(nodes, { type: 'move_down' })
      expect(newNodes[0].child[0].isSelected).toBeFalsy();
      expect(newNodes[0].child[1].isSelected).toBeTruthy();
    });
  });

  describe('first nodes with two childs and hidden', () => {
    beforeEach(() => {
      nodes[0].child = twoNodes();
      nodes[0] = { ...nodes[0], isSelected: true, isHidden: true };
    });

    it('should skip subchilds and select second root node', () => {
      const newNodes = reducer(nodes, { type: 'move_down' });
      expect(newNodes[0].isSelected).toEqual(false);
      expect(newNodes[1].isSelected).toEqual(true);
    });
  });
});

