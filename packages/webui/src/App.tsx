import { useRoutes } from 'react-router-dom';
import './App.css';
import CiPage from './ci';
import TestPage from './page/test';

function App() {
  const element = useRoutes([
    { path: '/test', element: <TestPage /> },
    { path: '/ci', element: <CiPage /> },
  ]);

  return element;
}

export default App;
