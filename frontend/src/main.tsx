import React from 'react';
import ReactDOM from 'react-dom/client';
import './style/reset.css';
import './style/index.css';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import { ErrorPage } from './pages/ErrorPage';
import { RootPage } from './pages/RootPage';
import { HomePage } from './pages/HomePage';
import { LoginPage } from './pages/LoginPage';
import { Provider } from 'react-redux';
import { rootStore } from './store/rootStore';
import { PeoplePage } from './pages/PeoplePage';
import { UserPage } from './pages/UserPage';

const router = createBrowserRouter([
  {
    path: '/',
    element: <RootPage />,
    errorElement: <RootPage error={<ErrorPage />} />,
    children: [
      {
        errorElement: <ErrorPage />,
        children: [
          {
            index: true,
            element: <HomePage />,
          },
          {
            path: '/login',
            element: <LoginPage />,
          },
          {
            path: '/people',
            element: <PeoplePage />,
          },
          {
            path: '/user',
            element: <UserPage />,
          },
        ],
      },
    ],
  },
]);

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Provider store={rootStore}>
      <RouterProvider router={router} />
    </Provider>
  </React.StrictMode>
);
