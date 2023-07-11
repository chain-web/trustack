import { useRoutes } from 'react-router-dom';
import './App.css';
import CiPage from './ci';
import { VisPage } from './vis';

function App() {
  const element = useRoutes([
    { path: '/ci', element: <CiPage /> },
    { path: 'vis', element: <VisPage /> },
  ]);
  return element;
}

export default App;
