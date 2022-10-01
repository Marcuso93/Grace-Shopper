import React, { useState, useEffect } from "react";
import { fetchCart, getLocalUser, patchItemInCart, postNewOrder, removeItemFromCart } from "../utilities/apiCalls";
import { checkLocalStorage, filterOutOldVersion } from "../utilities/utils";

// TODO:
// local storage for visitor cart

const Cart = ({ user, setUser, token, setToken }) => {
  const [cartItems, setCartItems] = useState([]);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [updatingItemId, setUpdatingItemId] = useState(false);
  const [quantity, setQuantity] = useState(0);

  useEffect(() => {
    (async () => {
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
        const cart = await fetchCart({ userId: user.id, token });
        if (cart.message && cart.name !== 'EmptyCart' && cart.name !== 'undefined') {
          alert(`Error: ${cart.message}.`)
        }
        setCartItems(cart);
      } else {
        console.log("No user.id")
      }
    })()
  }, [user])

  const handleUpdateItem = async (event, item) => {
    event.preventDefault();
    event.stopPropagation();

    if (item.userId === user.id) {
      const updatedCartItem = await patchItemInCart(token, item.cartInventoryId, { quantity })

      if (updatedCartItem.message) {
        alert(`Error: ${updatedCartItem.message}`);
      } else if (updatedCartItem.id) {
        item.quantity = quantity;
        setCartItems([item, ...filterOutOldVersion(cartItems, item)]);
        setUpdatingItemId(false);
      } else {
        alert(`There was an error updating this item in your cart.`)
      }
    } else {
      alert(`Error: User ${user ? user.username : null} is not allowed to update this cart item.`)
    }
  }

  const handleRemoveItem = async (event, item) => {
    event.preventDefault();
    event.stopPropagation();
    if (item.userId === user.id) {
      const removedItem = await removeItemFromCart(token, item.cartInventoryId);

      if (removedItem.message) {
        alert(`Error: ${removedItem.message}`);
      } else if (removedItem.id) {
        setCartItems(filterOutOldVersion(cartItems, item));
      } else {
        alert(`There was an error removing this item from your cart.`)
      }
    } else {
      alert(`Error: User ${user ? user.username : null} is not allowed to remove this cart item.`)
    }
  }

  const handlePlaceOrder = async (event) => {
    event.preventDefault();
    event.stopPropagation();

    const newOrder = await postNewOrder(token, {
      userId: user.id,
      price: getPrice(),
      orderDate: new Date().getTime()
    });

    if (newOrder.message) {
      alert(`Error: ${newOrder.message}.`);
    } else if (newOrder.id) {
      setCartItems([]);
      setOrderSuccess(true);
    } else {
      alert('There was an error placing your order.')
    }
  }

  const getPrice = () => {
    let arr = [];
    cartItems.forEach(item => arr.push(item.price))
    return arr.reduce((total, amount) => total + amount)
  }

  if (user) {

    return (
      <div className="cart-container">
        <h2 className="page-titles"> Cart </h2>
        <div>
          {
            orderSuccess ?
              <div>Your order was successfully placed. See the orders tab to review your order(s).</div> :
              null
          }
          {
            ((cartItems && cartItems.name === 'EmptyCart') || (cartItems && cartItems.length < 1)) ?
              <div className="cart-item" style={{textAlign: 'center'}}>Your cart is empty!</div> :
              <button onClick={(event) => {
                handlePlaceOrder(event);
              }}>Place Order</button>
          }
          {
            (cartItems && cartItems.length > 0) ?
              cartItems.map(item => {
                return (
                  <div className="cart-item" key={item.cartInventoryId}>
                    {
                      (item.image) ?
                        <img src={item.image} className='inventory-img' /> :
                        null
                    }
                    <div className="cart-info">
                      <h2>{item.name}</h2>
                      <p>Price: ${item.price/100}</p>
                      {
                        (updatingItemId && item.cartInventoryId === updatingItemId) ?
                          <>
                            <form onSubmit={(event) => {
                              handleUpdateItem(event, item)
                            }}>
                              <p>Quantity?
                                <input
                                  required
                                  type='number'
                                  min='1'
                                  max={item.stock}
                                  defaultValue={item.quantity}
                                  onChange={(event) => setQuantity(event.target.value)}
                                />
                                <button type="submit">Update</button>
                                <button onSubmit={(event) => {
                                  event.preventDefault();
                                  setUpdatingItemId(false);
                                }}>Cancel</button></p>
                            </form>
                          </> :
                          <p>Quantity in Cart: {item.quantity}</p>
                      }
                      <p>{item.description}</p>
                      {
                        item.isCustomizable ?
                          <p>This item is customizable upon request.</p> :
                          null
                      }
                      <p>{(item.stock && item.stock > 0) ? `Items in stock : ${item.stock}` : 'Out of stock!'}</p>
                      <button onClick={(event) => {
                        event.preventDefault();
                        setUpdatingItemId(item.cartInventoryId);
                      }}>Update</button>
                      <button onClick={(event) => {
                        handleRemoveItem(event, item);
                      }}>Remove</button>
                    </div>
                  </div>
                )
              }) :
              null
          }
        </div>
      </div>
    )
  } else return null
};

export default Cart