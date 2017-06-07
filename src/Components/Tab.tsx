import styled from 'styled-components';
import {footerHeight} from '../constants';

// TODO: fix ugly calculations
export default styled.div`
  position: fixed;
  top: 0;
  ${(props: any) => props.right ? 'right: 0;' : 'left:0;'}
  bottom: ${footerHeight}px;
  ${(props: any) => props.isHidden ? 'width: 30px;' : 'width: 50%;'}
  ${(props: any) => props.showFull ? 'width: calc(100% - 30px);' : ''}
  borderLeft: 1px solid grey;
  transition: box-shadow 0.1s linear;
  ${(props: any) => props.isFocused && 'box-shadow: inset 0px 0px 20px -3px rgba(0,0,0,0.75)'};
` as any;
