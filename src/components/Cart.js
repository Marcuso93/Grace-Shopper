import React, {useState, useEffect} from "react";
import {useHistory} from "react-router-dom";
import { fetchCart, getLocalUser } from "../utilities/apiCalls";
import { checkLocalStorage } from "../utilities/utils";

//would need a local storage for cart
//will need user and token
const Cart = ({user, setUser, token, setToken}) => {
  const [cartItems, setCartItems] = useState([])

  useEffect(() => {
    (async() => {
      // TODO: fix localStorage
      if (!token) {
        const localToken = checkLocalStorage();
        if (localToken) {
          setToken(localToken)
        }
      }
      if (!user) {
        const localUser = await getLocalUser();
        if (localUser) {
          setUser(localUser); 
        }
      } 
      if (user.id) {
        const cart = await fetchCart({userId: user.id, token});
        if (cart.message && cart.name !== 'EmptyCart') {
          alert(`Error: ${cart.message}.`)
        }
        setCartItems(cart);
      } else {
        console.log("No user.id")
      }
    })()
  }, [user])
 
  return (
    <div className="cart-background">
      <h2> Cart </h2>
      {
        (cartItems && cartItems.name === 'EmptyCart') ?
        <div>Your cart is empty!</div> :
        null
      }
      {
        (cartItems && cartItems.length > 0) ?
        cartItems.map(item => {
          return (
            <div className="cart-item" key={item.cartInventoryId}>
              <h2>{item.name}</h2>
              {
                (item.image) ?
                  <img src={require(`${item.image}`)} className='inventory-img' /> :
                  null
              }
              <p>Price: ${item.price}.00</p>
              <p>Items in cart: {item.quantity}</p>
              <p>{item.description}</p>
              {
                item.isCustomizable ?
                <p>This item is customizable upon request.</p> :
                null
              }
              <p>Items in stock: {item.stock}</p>
            </div>
          )
        }):
        null
      }
    </div>
  )
}

export default Cart