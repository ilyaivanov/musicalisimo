import * as React from 'react';
import styled from 'styled-components';
import {footerHeight} from '../constants';

const Header = styled.h3`
  textAlign: center;
`;

const Box = styled.div`
  backgroundColor: white;
  position: absolute;
  bottom: ${footerHeight + 15}px;
  right: 15px;
  border: 1px solid grey;
  width: 240px;
  box-shadow: 0 2px 12px rgba(0,0,0,0.6);
`;

const CommandName = styled.td`
  fontSize: 12px;
  width: 70px;
  background: #efefef;
`;
const CommandText = styled.td`
  fontSize: 13px;
  width: 170px;
`;

const shortcuts = [
  {text: 'Go to search field', command: 'Alt + 1'},
  {text: 'Go to search results', command: 'Alt + 2'},
  {text: 'Go to favorites', command: 'Alt + 3'},
  {text: 'Move up/down/left/right', command: '↑ / ↓ / ← / →'},
  {text: 'Play track', command: 'Space'},
  {text: 'Set node as context', command: 'Alt + Enter'},
  {text: 'Exit from context', command: 'ESC'},
  {text: 'Add node to Favorites', command: 'Control + Enter'},
  {text: 'Rename node', command: 'F2'},
  {text: 'Stop renaming node', command: 'ESC'},
  {text: 'Delete node', command: 'Delete'},
  {text: 'Reload node', command: 'Alt + R'},
  {text: 'Move node up/down', command: 'Control + Shift + ↑ / ↓'},
  {text: 'Move node left/right', command: 'Control + Shift + ← / →'},
  {text: 'Show/hide youtube', command: 'Alt + S'},
  {text: 'Show/hide this panel', command: 'Control + ?'},
];

const Guide = (props) => (
  <Box>
    <Header>Keyboard Shortcuts</Header>
    <table>
      <tbody>
      {shortcuts.map((shortcut, i) => (
        <tr key={i}>
          <CommandName>
            {shortcut.text}
          </CommandName>
          < CommandText >
            {shortcut.command}
          </CommandText>
        </tr>
      ))}
      </tbody>
    </table>
  </Box>
);
export default Guide;