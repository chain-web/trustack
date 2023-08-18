import { evalCode } from '@trustack/contract';
import { Button } from 'antd';
import { useState } from 'react';
import { MonacoEditor } from '../components/monacoEditor/editor';

export function VMPage() {
  const [evalResult, setEvalResult] = useState<string>('');
  const onChange = (newValue: string) => {
    setEvalResult('loading...');
    evalCode(newValue).then((result) => {
      setEvalResult(JSON.stringify(result, null, 2));
    });
  };

  return (
    <div
      style={{
        textAlign: 'left',
      }}
      className="vm-box"
    >
      <MonacoEditor onBlur={onChange} />
      <Button>evalResult: </Button>
      <div
        style={{
          marginTop: '50px',
          padding: '10px',
          border: '1px solid #ccc',
        }}
      >
        {evalResult}
      </div>
    </div>
  );
}
