import { Button } from 'antd';
import { useState } from 'react';
import { runTest } from './run';

export default function CiPage() {
  const [passed, setPass] = useState(false);
  return (
    <div className="ci-box">
      <div>
        <Button
          data-testid="start"
          type="default"
          onClick={async () => {
            const res = await runTest();
            setPass(res);
          }}
        >
          start
        </Button>
      </div>

      {/* <Button
        test-id="start"
        type="default"
        onClick={async () => {
          const res = await runTest();
          setPass(res);
        }}
      >
        stop
      </Button> */}
      <span data-testid="passed">{passed.toString()}</span>
    </div>
  );
}
