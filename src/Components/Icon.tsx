import * as React from 'react';
import styled from 'styled-components';

interface Props {
  name: string;
  onClick?: Function;
  spin?: boolean;
  played?: boolean;
  children?: JSX.Element;
}

const Icon = styled.i`
  cursor: pointer;
  &:hover{
    color: red;
  }
` as any;

const getClassName = (props: Props) => {
  let base = 'fa fa-' + props.name;
  if (props.spin) {
    base += ' fa-spin';
  }
  if (props.played) {
    base += ' faa-pulse animated';
  }
  return base;
};
const IconComponent: React.StatelessComponent<Props> = (props: Props) => (
  <Icon
    className={getClassName(props)}
    aria-hidden="true"
    onClick={() => props.onClick && props.onClick()}
  >
    {props.children}
  </Icon>
);

export default IconComponent;