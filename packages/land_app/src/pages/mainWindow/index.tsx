import { useEffect } from 'react';
// import ChangeI18n from '../../config/i18n/i18nSelect';
import Tabbar from './components/Tabbar';
import { mapAction } from './map';

export function MainWindow() {
  useEffect(() => {
    console.log('MainWindow init');
    mapAction.init();
  }, []);
  return (
    <div className="main-box">
      <Tabbar />
    </div>
  );
}
