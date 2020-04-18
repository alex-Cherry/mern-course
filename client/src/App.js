import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import 'materialize-css';

import { useRoutes } from './routes';
import { useAuth } from './hooks/useAuth';
import { AuthContext } from './context/auth.context';
import Navbar from './components/navbar';
import Loader from './components/loader';

function App() {

  const { token, userId, login, logout,ready } = useAuth();
  const isAuthenticated = !!token;
  const routes = useRoutes(isAuthenticated);

  if (!ready) {
    return <Loader />;
  }

  return (
    <AuthContext.Provider value={ { token, userId, login, logout, isAuthenticated } }>
      <Router>
        {isAuthenticated && <Navbar />}
        <div className="container">
          {routes}
        </div>
      </Router>
    </AuthContext.Provider>
  );
}

export default App;
