import reducer from './nodes';
let id = 1;
const node = () => ({ id: id++ });
const twoNodes = () => [node(), node()];

const single = items => {
  if (items.length != 1) {
    throw new Error()
  }
  return items[0];
};

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
      const newNodes = reducer(nodes, { type: 'move_down' });
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

  describe('when first node is selected', () => {
    beforeEach(() => {
      nodes[0].isSelected = true;
    });

    it('removing second item should return nodes with one item', () => {
      const expectedNode = [nodes[1]];
      const newNodes = reducer(nodes, { type: 'delete_selected' });
      expect(newNodes).toEqual(expectedNode);
    });

    it('moving node down should swap nodes down', () => {
      const expectedState = [nodes[1], nodes[0]];
      const newState = reducer(nodes, { type: 'move_node_down' });
      expect(newState).toEqual(expectedState);
    });
  });

  describe('when second node is selected', () => {
    beforeEach(() => {
      nodes[1].isSelected = true;
    });

    it('moving node up should swap nodes up', () => {
      const expectedState = [nodes[1], nodes[0]];
      const newState = reducer(nodes, { type: 'move_node_up' });
      expect(newState).toEqual(expectedState);
    });

    describe('removing a node', () => {
      let newNodes;
      beforeEach(() => {
        newNodes = reducer(nodes, { type: 'delete_selected' });
      });

      it('should leave only first node', () => {
        expect(single(newNodes).id).toEqual(nodes[0].id);
      });

      it('should select first node', () => {
        expect(single(newNodes).isSelected).toEqual(true);
      });
    });
  });

  describe('having two childs in first node ', () => {
    beforeEach(() => {
      nodes[0].child = twoNodes();
    });
    describe('with first subchild selected', () => {
      beforeEach(() => {
        nodes[0].child[0].isSelected = true;
      });

      describe('deleting selected node', () => {
        let newNodes;
        beforeEach(() => {
          newNodes = reducer(nodes, { type: 'delete_selected' });
        });
        it('should not change root nodes', () => {
          expect(newNodes.length).toEqual(2);
        });
        it('should remove first subchild', () => {
          const expectedSubchildId = nodes[0].child[1].id;
          expect(single(newNodes[0].child).id).toEqual(expectedSubchildId);
        });
        it('should select first root node', () => {
          expect(newNodes[0].isSelected).toEqual(true);
        });
      });
    });
  });

});

