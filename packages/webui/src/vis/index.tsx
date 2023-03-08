import { Button } from 'antd';
import { useState } from 'react';
import { Timeline } from './timelineComp';

export function VisPage() {
  const [passed, setPass] = useState(false);
  const [skvmPassed, setSkvmPass] = useState(false);
  return (
    <div className="ci-box">
      <Timeline />
    </div>
  );
}
