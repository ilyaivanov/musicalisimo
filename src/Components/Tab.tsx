import styled from 'styled-components';
import {footerHeight} from '../constants';

interface Props {
  right: boolean;
  isHidden: boolean;
  showFull: boolean;
}

// TODO: fix ugly calculations
export default styled.div`
  position: fixed;
  top: 0;
  ${(props: Props) => props.right ? 'right: 0;' : 'left:0;'}
  bottom: ${footerHeight}px;
  ${(props: Props) => props.isHidden ? 'width: 30px;' : 'width: 50%;'}
  ${(props: Props) => props.showFull ? 'width: calc(100% - 30px);' : ''}
  borderLeft: 1px solid grey;
  transition: box-shadow 0.1s linear;
` as any;

// TODO: figure out how to merge HTMLProps and my custom Props
// type P = Props & React.HTMLProps<HTMLElement>; is not working