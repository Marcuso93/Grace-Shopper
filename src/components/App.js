import React, { useState, useEffect } from 'react';
import ReactDom from 'react-dom';
import { NavLink, Route } from 'react-router-dom'; 
// getAPIHealth is defined in our axios-services directory index.js
// you can think of that directory as a collection of api adapters
// where each adapter fetches specific info from our express server's /api route
// import { getAPIHealth } from '../axios-services';
import '../style/App.css';
import {
  Home,
  Account,
  Inventory,
  Cart,
  Admin,
  Logout
} from './index';
import { getLocalUser } from '../utilities/apiCalls';
import { checkLocalStorage } from '../utilities/utils';


const App = () => {
  // const [APIHealth, setAPIHealth] = useState('');
  const [user, setUser] = useState(false);
  const [token, setToken] = useState('');
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  useEffect(() => {
    (async () => {
      if (!token) {
        const localToken = checkLocalStorage();
        if (localToken) {
          setToken(localToken);
          console.log('Token set.')
          const localUser = await getLocalUser();
          if (localUser) { 
            setUser(localUser) }
            console.log('User set.')
        }
      }
    })()
  }, []);

  return (
    <main>
      <nav className='navbar'>
        <NavLink to="/home" className="navlink" activeClassName="active">
          Home
        </NavLink>
    
        <NavLink to="/inventory" className="navlink" activeClassName="active">
          Inventory
        </NavLink>
    
        <NavLink to="/cart" className="navlink" activeClassName="active">
          Cart
        </NavLink>

        <NavLink to="/account" className="navlink" activeClassName="active">
          { (user && token) ? 'Account' : 'Login/Register' }
        </NavLink>
        
        {
          (user && token && user.isAdmin) ?
          <NavLink to="/admin" className="navlink" activeClassName="active">
            Admin
          </NavLink> :
          null
        }

        {
          (token && user) ?
          <input
            type='button'
            value='Logout'
            className='navlink'
            onClick={(event) => {
              event.preventDefault();
              setIsLoggingOut(true);
            }}
          /> :
          null
        }

      </nav>

      <Route path="/home">
        <Home />
      </Route>

      <Route path="/inventory">
        <Inventory/>
      </Route>

      <Route path="/account">
        <Account token={token} setToken={setToken} user={user} setUser={setUser} />
      </Route>

      <Route path="/cart">
        <Cart />
      </Route>

      <Route path="/admin">
        <Admin />
      </Route>

      <Logout 
        isLoggingOut={isLoggingOut} 
        setIsLoggingOut={setIsLoggingOut} 
        setUser={setUser} 
        setToken={setToken} 
      />
    </main>
    // <div className="app-container">
    //   <h1>Hello, World!</h1>
    //   <p>API Status: {APIHealth}</p>
    // </div>
  );
};

export default App;
