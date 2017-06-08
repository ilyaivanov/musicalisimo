import * as React from 'react';

interface Props {
  name: string;
  spin?: boolean;
  played?: boolean;
  children?: JSX.Element;
}
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
export default (props: Props) => (
  <i
    className={getClassName(props)}
    aria-hidden="true"
  >
    {props.children}
  </i>
);
