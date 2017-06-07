import * as React from 'react';

export default (props: { name: string, spin?: boolean, children?: JSX.Element }) => (
  <i
    className={'fa fa-' + props.name + (props.spin ? ' fa-spin' : '')}
    aria-hidden="true"
    {...props}
  >
    {props.children}
  </i>
);
