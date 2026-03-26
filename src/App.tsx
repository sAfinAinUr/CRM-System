import { Provider } from 'react-redux';
import { createBrowserRouter, RouterProvider } from 'react-router';

import LayoutAuth from './pages/LayoutAuth';
import LayoutMainApp from './pages/LayoutMainApp';
import LoginPage from './pages/LoginPage';
import ProfilePage from './pages/ProfilePage';
import RegisterPage from './pages/RegisterPage';
import TodoListPage from './pages/TodoListPage';
import UserProfilePage from './pages/UserProfilePage';
import { store } from './store/store';

const router = createBrowserRouter([
  {
    element: <LayoutMainApp />,
    children: [
      {
        path: '/',
        element: <TodoListPage />
      },
      {
        path: '/profile',
        element: <ProfilePage />
      }
    ]
  },
  {
    element: <LayoutAuth />,
    children: [
      {
        path: '/login',
        Component: LoginPage
      },
      {
        path: '/register',
        Component: RegisterPage
      }
    ]
  },
  {
    path: '/UserProfile/:id',
    Component: UserProfilePage
  }
]);

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  );
};

export default App;
