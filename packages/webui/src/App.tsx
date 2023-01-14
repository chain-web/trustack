import { useRoutes } from 'react-router-dom';
import './App.css';
import TestPage from './page/test';

function App() {
  let element = useRoutes([{ path: '/test', element: <TestPage /> }]);

  return element;
}

export default App;
