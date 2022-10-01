import React, { useState, useEffect } from 'react';
// import ReactDom from 'react-dom';
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
  FeaturedInventory,
  CreateReview,
  CreateInventory,
  UpdateInventory,
  Cart,
  Orders,
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
  const [items, setItems] = useState([]);
  const [featuredItem, setFeaturedItem] = useState([])
  const [isCreatingReview, setIsCreatingReview] = useState(false);
  const [featuredItemReviews, setFeaturedItemReviews] = useState([]);
  const [isCreatingInventory, setIsCreatingInventory] = useState(false);
  const [updatingInventory, setUpdatingInventory] = useState(false);
  const [menuOpen, setMenuOpen] =useState(false);


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
      <div className='title'>
        <div className="logo">Kevin & co Woodworking</div>
        <div className={ `hamburger${(menuOpen) ? '-open' : '-closed'}` } onClick={ () => (menuOpen) ? setMenuOpen(false) : setMenuOpen(true) }>
        <div class="menu-btn__burger"></div>
          </div>
      <nav className={ `navbar${(menuOpen) ? '-here' : '-away'}` } onClick={ () => (menuOpen) ? setMenuOpen(false) : setMenuOpen(true) }>
        
        <NavLink to="/home" className="navlink" activeClassName="active">
          Home
        </NavLink>
    
        <NavLink to="/inventory" className="navlink" activeClassName="active">
          Inventory
        </NavLink>
    

        {
          (user && token) ?
          <>
            <NavLink to="/cart" className="navlink" activeClassName="active">
              Cart
            </NavLink>
          
            <NavLink to="/orders" className="navlink" activeClassName="active">
              Orders
            </NavLink> 
          </> :
          null
        }

        {
          (user && token && user.isAdmin) ?
          <NavLink to="/admin" className="navlink" activeClassName="active">
            Users
          </NavLink> :
          null
        }

        <NavLink to="/account" className="navlink" activeClassName="active">
          { (user && token) ? 'Account' : 'Login/Register' }
        </NavLink>
        
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
     </div>

      <Route exact path={["/home", "/"]}>
        <Home />
      </Route>

      <Route path="/inventory">
        <Route path="/inventory/:itemId">
          <FeaturedInventory 
            user={user}
            token={token}
            featuredItem={featuredItem} 
            setFeaturedItem={setFeaturedItem} 
            setIsCreatingReview={setIsCreatingReview} 
            featuredItemReviews={featuredItemReviews} 
            setFeaturedItemReviews={setFeaturedItemReviews} />
        </Route>
        <Inventory 
          user={user} 
          token={token} 
          items={items} 
          setItems={setItems} 
          setFeaturedItem={setFeaturedItem} 
          setUpdatingInventory={setUpdatingInventory} />
        <CreateReview 
          user={user} 
          token={token} 
          isCreatingReview={isCreatingReview} 
          setIsCreatingReview={setIsCreatingReview} 
          featuredItemReviews={featuredItemReviews} 
          setFeaturedItemReviews={setFeaturedItemReviews}
          items={items}
          setItems={setItems} 
          featuredItem={featuredItem} 
          setFeaturedItem={setFeaturedItem}/>
          {/* TODO: EditReviews? */}
        <CreateInventory 
          user={user} 
          token={token} 
          isCreatingInventory={isCreatingInventory} 
          setIsCreatingInventory={setIsCreatingInventory}
          items={items} 
          setItems={setItems}/>
        <UpdateInventory 
          user={user}
          token={token}
          updatingInventory={updatingInventory}
          setUpdatingInventory={setUpdatingInventory}
          items={items}
          setItems={setItems}
        />

      </Route>

      <Route path="/account">
        <Account token={token} setToken={setToken} user={user} setUser={setUser} />
      </Route>

      <Route path="/cart">
        <Cart user={user} setUser={setUser} token={token} setToken={setToken}/>
      </Route>

      <Route path="/orders">
        <Orders user={user} setUser={setUser} token={token} setToken={setToken} />
      </Route>

      {
        (token && user && user.isAdmin) ?
        <Route path="/admin">
          <Admin token={token} user={user} />
        </Route> :
        null
      }

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
