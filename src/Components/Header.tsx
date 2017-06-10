import * as React from 'react';
import styled from 'styled-components';

interface Props {
  isVertical?: boolean;
}

export default styled.h2`
  textAlign: center;
  ${(props: Props) => props.isVertical ?
  `
		transform: rotate(90deg);
		transform-origin: left bottom;
	` :
  ``
  }
` as any as React.StatelessComponent<Props>;
