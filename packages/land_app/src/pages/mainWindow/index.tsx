import { Button } from 'antd';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import ChangeI18n from '../../config/i18n/i18nSelect';
import { lanKeys } from './index.i18n';
import { Timeline } from './timelineComp';

export function MainWindow() {
  const [t] = useTranslation();
  const [passed, setPass] = useState(false);
  const [skvmPassed, setSkvmPass] = useState(false);
  return (
    <div className="ci-box">
      <ChangeI18n />
      <Button type="default" loading={true}>
        {t(lanKeys.start)}
      </Button>
      <Timeline />
    </div>
  );
}
