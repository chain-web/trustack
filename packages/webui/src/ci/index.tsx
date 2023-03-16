import { Button } from 'antd';
import { useState } from 'react';
import { runContractTest, runSkvmTest, runTest } from './run';

export default function CiPage() {
  const [passed, setPass] = useState(false);
  const [skvmPassed, setSkvmPass] = useState(false);
  const [contractPassed, setContractPass] = useState(false);
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
        <span data-testid="passed">{passed.toString()}</span>
      </div>

      <div style={{ padding: 50 }}>
        <Button
          data-testid="start_skvm"
          type="default"
          onClick={async () => {
            const res = await runSkvmTest();
            setSkvmPass(res);
          }}
        >
          start_skvm
        </Button>
        <span data-testid="skvm_passed">{skvmPassed.toString()}</span>
      </div>

      <div style={{ padding: 50 }}>
        <Button
          data-testid="test_contract"
          type="default"
          onClick={async () => {
            const res = await runContractTest();
            setContractPass(res);
          }}
        >
          test_contract
        </Button>
        <span data-testid="contract_passed">{contractPassed.toString()}</span>
      </div>
    </div>
  );
}
