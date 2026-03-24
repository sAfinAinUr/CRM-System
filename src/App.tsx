import TodoListPage from './pages/TodoListPage';

import { createBrowserRouter, RouterProvider } from 'react-router';
import ProfilePage from './pages/ProfilePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import { Provider } from 'react-redux';
import { store } from './store';
import LayoutMainApp from './pages/LayoutMainApp';
import LayoutAuth from './pages/LayoutAuth';

const router = createBrowserRouter([
  {
    element: <LayoutMainApp />,
    children: [
      {
        path: '/',
        element: <TodoListPage />,
      },
      {
        path: '/profile',
        element: <ProfilePage />,
      },
    ],
  },
  {
    element: <LayoutAuth />,
    children: [
      {
        path: '/login',
        Component: LoginPage,
      },
      {
        path: '/register',
        Component: RegisterPage,
      },
    ],
  },
]);

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  );
};

export default App;
