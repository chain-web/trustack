import React from 'react';
import ReactJson from 'react-json-view';

export function JsonView(props: { data: object }) {
  return (
    <ReactJson
      name={false}
      indentWidth={2}
      enableClipboard={false}
      src={props.data}
      collapsed={true}
    />
  );
}
