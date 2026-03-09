import TodoListPage from './pages/TodoListPage';

import { createBrowserRouter, RouterProvider } from 'react-router';
import ProfilePage from './pages/ProfilePage';

const router = createBrowserRouter([
  {
    path: '/',
    Component: TodoListPage,
  },
  {
    path: '/profile',
    Component: ProfilePage,
  },
]);

const App: React.FC = () => {
  return <RouterProvider router={router} />;
};

export default App;
