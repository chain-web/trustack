import { useRoutes } from 'react-router-dom';
import './config/i18n/i18n';
import './App.css';
import { MainWindow } from './pages/mainWindow';

function App() {
  const element = useRoutes([{ path: '*', element: <MainWindow /> }]);
  return element;
}

export default App;
