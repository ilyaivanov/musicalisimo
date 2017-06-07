import * as React from 'react';

export default (props: { name: string, children?: JSX.Element }) => (
  <i className={'fa fa-' + props.name} aria-hidden="true" {...props}>
    {props.children}
  </i>
);
