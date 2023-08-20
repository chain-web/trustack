import { useRoutes } from 'react-router-dom';
import './App.css';
import CiPage from './ci';
import { VMPage } from './skvm';

function App() {
  const element = useRoutes([
    { path: '/ci', element: <CiPage /> },
    { path: '/vm', element: <VMPage /> },
  ]);
  return element;
}

export default App;
