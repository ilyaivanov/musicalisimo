import styled from 'styled-components';

export default styled.h2`
  textAlign: center;
  ${(props: any) => props.isVertical ?
  `
		transform: rotate(90deg);
		transform-origin: left bottom;
	` :
  ``
  }
` as any;
