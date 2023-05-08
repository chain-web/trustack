import { useRoutes } from 'react-router-dom';
import './App.css';
import CiPage from './ci';
import TestPage from './page/test';
import { VisPage } from './vis';

function App() {
  const element = useRoutes([
    { path: '/test', element: <TestPage /> },
    { path: '/ci', element: <CiPage /> },
    { path: 'vis', element: <VisPage /> },
  ]);
  return element;
}

export default App;
