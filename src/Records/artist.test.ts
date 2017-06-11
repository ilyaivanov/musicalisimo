import {createNode, MyNode} from './artist';
describe('working with a new node', () => {
  let node: MyNode;
  beforeEach(() => {
    node = createNode({text: 'myText', type: 'album'});
  });

  it('node should be created', () => {
    expect(node.text).toEqual('myText');
    expect(node.type).toEqual('album');
    expect(node.id.length).toBeGreaterThan(0);
  });

  it('node should be modified via with method', () => {
    const newNode = node.with({text: 'newtext'});
    expect(newNode.text).toEqual('newtext');
  });
});
