import { Provider } from 'react-redux';
import { createBrowserRouter, RouterProvider } from 'react-router';

import AdminPage from './pages/AdminPage';
import LoginPage from './pages/LoginPage';
import ProfilePage from './pages/ProfilePage';
import RegisterPage from './pages/RegisterPage';
import TodoListPage from './pages/TodoListPage';
import UserProfilePage from './pages/UserProfilePage';
import { AuthProvider } from './providers/AuthProvider';
import { store } from './store';

const router = createBrowserRouter([
  {
    path: '/',
    Component: () => (
      <AuthProvider>
        <TodoListPage />
      </AuthProvider>
    )
  },
  {
    path: '/profile',
    Component: () => (
      <AuthProvider>
        <ProfilePage />
      </AuthProvider>
    )
  },
  {
    path: '/admin',
    Component: () => (
      <AuthProvider>
        <AdminPage />
      </AuthProvider>
    )
  },
  {
    path: '/login',
    Component: LoginPage
  },
  {
    path: '/register',
    Component: RegisterPage
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
