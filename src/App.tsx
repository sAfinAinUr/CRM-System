import TodoListPage from './pages/TodoListPage';

import { createBrowserRouter, RouterProvider } from 'react-router';
import ProfilePage from './pages/ProfilePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import { Provider } from 'react-redux';
import { store } from './store';
import { AuthProvider } from './providers/AuthProvider';
import AdminPage from './pages/AdminPage';

const router = createBrowserRouter([
  {
    path: '/',
    Component: () => (
      <AuthProvider>
        <TodoListPage />
      </AuthProvider>
    ),
  },
  {
    path: '/profile',
    Component: () => (
      <AuthProvider>
        <ProfilePage />
      </AuthProvider>
    ),
  },
  {
    path: '/admin',
    Component: () => (
      <AuthProvider>
        <AdminPage />
      </AuthProvider>
    ),
  },
  {
    path: '/login',
    Component: LoginPage,
  },
  {
    path: '/register',
    Component: RegisterPage,
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
