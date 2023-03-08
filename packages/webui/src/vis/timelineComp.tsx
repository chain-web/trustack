import { Button, Input } from 'antd';
import React, { useState } from 'react';
import { renderPl } from './timeline';

export function Timeline() {
  const [pl, setPl] = useState('{}');
  return (
    <div className="vis-box">
      <div>
        <Input
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          onChange={(e: any) => {
            setPl(e.tatget.value);
          }}
        />
        <Button
          data-testid="start"
          type="default"
          onClick={async () => {
            renderPl(JSON.parse(pl));
          }}
        >
          vis
        </Button>
      </div>

      {/* <div style={{ padding: 50 }}>
        <Button
          data-testid="start_skvm"
          type="default"
          onClick={async () => {}}
        >
          start_skvm
        </Button>
        <span data-testid="skvm_passed">{skvmPassed.toString()}</span>
      </div> */}
    </div>
  );
}
