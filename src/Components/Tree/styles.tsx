import * as React from 'react';
import styled from 'styled-components';

const oneLevelPadding = 20;

// old f0f4f7 from mockup
// 05 - C4DFE6 66A5AD
// 30 - D0E1F9 4D648D
// 42 - EAE2D6 D5C3AA 867666 E1B80D
export const Stripe = styled.div`
  width: 100%;
  ${(props: any) => props.isEven && `backgroundColor: #f0f4f7;`}
  ${(props: any) => props.isSelected && `backgroundColor: #EAE2D6;`}
  ${(props: any) => props.isPlaying && `backgroundColor: #D0E1F9;`}
  paddingLeft: ${(props: any) => props.level * oneLevelPadding}px;
  
  .fa-minus,
  .fa-plus{
    visibility: hidden;
  }
  
  &:hover{
    .fa-minus,
    .fa-plus{
      visibility: visible;
    }
  }
` as any;

export const Node = styled.div`
  position: relative;
  ${(props: any) => props.isClean ?
  `` :
  `width: calc(70% - ${props.level * oneLevelPadding}px);`
  }
  marginLeft: 10px;
  // borderRight: 1px solid #E1B80D;
  display: inline-block;
` as any;

export const Tag = styled.span`
  fontSize: 12px;
  marginLeft: 5px;
` as any;

export const Info = styled.div`
  fontSize: 12px;
  position: absolute;
  top:5px;
  bottom: 0;
  right: 5px;
`;
export const Text = styled.span`
  display: inline-block;
  paddingLeft: 10px;
  marginTop: 5px;
  marginBottom: 5px;
  height: 20px;
` as any;

export const NodeBeingEdited = (props: any) => (
  <input
    type="text"
    onClick={e => e.stopPropagation()}
    onChange={e => props.onNodeTextChange(e.currentTarget.value)}
    value={props.node.text}
    autoFocus={true}
  />
);
export const SimpleNode = styled.span`
  fontWeight: bold;
  textOverflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
  paddingRight: 3px;
`;

// 57 - ugly constant, height of the Favorites Header
export const ScrollingContainer = styled.div`
  height: calc(100% - 57px);
  overflowY: auto;
  overflowX: hidden;  
`;