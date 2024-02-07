import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';

import Home from './Home';
import AdminPage from './components/Admin/AdminPage';
import LoginPage from './components/Login/LoginPage';
import { useState } from 'react';



function App() {
  const [loggedIn, setLoggedIn] = useState(false);

  const router = createBrowserRouter([
    { path: '/', element: <Home /> },
    { path: '/login', element: <LoginPage onLogin={() => setLoggedIn(true)} /> },
    { path: '/admin', element: loggedIn ? <AdminPage /> : <Navigate to="/login" /> },
  ]);

  
  return <RouterProvider router={router} />;
}

export default App;