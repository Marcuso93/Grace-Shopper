import React, {useState, useEffect} from "react";
import {useHistory} from "react-router-dom";
import { fetchCart, getLocalUser } from "../utilities/apiCalls";
import { checkLocalStorage } from "../utilities/utils";

//would need a local storage for cart
//will need user and token
const Cart = ({user, setUser, token, setToken}) => {
  const [cartItems, setCartItems] = useState([])
  console.log('user', user)
  
  useEffect(() => {
    (async() => {
      console.log('is user here', user)
      // TODO: fix localStorage
      if (!user) {
        const localUser = await getLocalUser();
        if (localUser) {
          setUser(localUser); 
        } else {
          alert("You aren't logged in.")
        }
      } 
      if (!token) {
        const localToken = await checkLocalStorage();
        if (localToken) {
          setToken(localToken)
        } else {
          alert("You aren't logged in.")
        }
      }
      console.log('user.id', user.id)
      if (user.id) {
        const cart = await fetchCart({userId: user.id, token});
      if (cart.message) {
        alert(`Error: ${cart.message}.`)
      }
      console.log(cart);
      setCartItems(cart);
      } else {
        console.log("something")
      }
    })()
  }, [user])
 
  return (
    <>
      <h2> Cart </h2>
      {/* map for item */}
      {
        (cartItems && cartItems.length > 0) ?
        cartItems.map(item => {
          return (
            <div key={item.id}>
              <h2>{item.id}</h2>
            </div>
          )
        }):
        null
      }
    </>
  )
}

export default Cart