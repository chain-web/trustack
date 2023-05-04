import React from 'react';

export function JsonView(props: { data: object }) {
  return <pre>{JSON.stringify(props.data)}</pre>;
}
