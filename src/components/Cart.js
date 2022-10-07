import React, { useState, useEffect } from "react";
import {
  fetchCart,
  getLocalUser,
  patchItemInCart,
  postNewOrder,
  removeItemFromCart
} from "../utilities/apiCalls";
import { checkLocalStorage, filterOutOldVersion } from "../utilities/utils";

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

  const setUpForUpdate = (event, item) => {
    event.preventDefault();
    event.stopPropagation();
    setUpdatingItemId(item.cartInventoryId);
  }

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
      setOrderSuccess(newOrder);
    } else {
      alert('There was an error placing your order.')
    }
  }

  const handleCancel = (event) => {
    event.preventDefault();
    event.stopPropagation();
    setUpdatingItemId(false);
  }

  const getPrice = () => {
    let arr = [];
    cartItems.forEach(item => arr.push(item.price))
    return arr.reduce((total, amount) => total + amount)
  }

  if (orderSuccess) {
    const date = new Date(Number(orderSuccess.orderDate));
    return (
      <>
        <div className='admin-orders'>
          <div className='page-titles'>Order Confirmation</div>
          <div key={orderSuccess.id} className="admin-indiv-orders">
            <div className='order-info'>
              <h3>Order ID: {orderSuccess.id}</h3>
              <div>Username: {user.username}</div><br />
              <div>Address: {user.address}</div>
              <div>Email: {user.email}</div><br />
              <div>Order Date: {date.toLocaleString()}</div>
              <div>Order Price: ${orderSuccess.price / 100}</div>
            </div>
            <div className='orders-right-side'>
              {
                (orderSuccess.items && orderSuccess.items.length > 0) ?
                  <>
                    <h3>Items in Order</h3>
                    <div className='items-container'>
                      {
                        orderSuccess.items.map((item) => {
                          return (
                            <div className='items-info' key={item.id}>
                              <h3>{item.name}</h3>
                              <div>Inventory Id: {item.inventoryId}</div>
                              <div>Price: ${item.price / 100}</div>
                              <div>Quantity: {item.quantity}</div>
                            </div>
                          )
                        })
                      }
                    </div>
                  </> :
                  null
              }
            </div>
          </div>
        </div>
      </>
    )
  } else if (user) {
    return (
      <div className="cart-container">
        <h2 className="page-titles"> Cart </h2>
        <div className="cart-form">
          {
            (!orderSuccess && ((cartItems && cartItems.name === 'EmptyCart') || (cartItems && cartItems.length < 1))) ?
              <div style={{ textAlign: 'center' }}>
                <p style={{ marginTop: '1em' }}>Your cart is empty!</p>
              </div> :
              <button onClick={(event) => {
                handlePlaceOrder(event);
              }}>Place Order</button>
          }
          {
            (cartItems && cartItems.length > 0) ?
              cartItems.map(item => {
                return (<>
                  <div className="cart-item" key={item.cartInventoryId}>
                    <div className="cart-item-top">
                      {
                        (item.image) ?
                          <img src={item.image} className='inventory-img' /> :
                          null
                      }
                      <div className="cart-info">
                        <h2>{item.name}</h2>
                        <p>{item.description}</p>
                        <p className="smaller-details">Price: ${item.price / 100}</p>
                        <p className="smaller-details">{(item.stock && item.stock > 0) ? `Items in stock : ${item.stock}` : 'Out of stock!'}</p>
                        {
                          item.isCustomizable ?
                            <p className="smaller-details">This item is customizable upon request.</p> :
                            null
                        }
                      </div>
                    </div>
                    <div className="cart-item-bottom">
                      {
                        (updatingItemId && item.cartInventoryId === updatingItemId) ?
                          <>
                            <form onSubmit={(event) => {
                              handleUpdateItem(event, item)
                            }}>
                              <p className='quantity-p'>Quantity?
                                <input
                                  required
                                  type='number'
                                  min='1'
                                  max={item.stock}
                                  defaultValue={item.quantity}
                                  onChange={(event) => setQuantity(event.target.value)}
                                /> </p>
                              <div className="cart-three-buttons">
                                <button className='quantity-form-buttons' type="submit">Update</button>
                                <button className='quantity-form-buttons' type='button' onClick={(event) => {
                                  handleRemoveItem(event, item);
                                }}>Remove</button>
                                <button className='quantity-form-buttons' type="button" onClick={(event) => {
                                  handleCancel(event);
                                }}>Cancel</button>
                              </div>
                            </form>
                          </> :
                          <p className="quantity-p">Quantity in Cart: {item.quantity}</p>
                      }
                      {
                        !updatingItemId ?
                          <div className="cart-info-buttons">
                            <button onClick={(event) => {
                              setUpForUpdate(event, item);
                            }}>Update</button>
                            <button onClick={(event) => {
                              handleRemoveItem(event, item);
                            }}>Remove</button>
                          </div> :
                          null
                      }
                    </div>
                  </div>
                </>
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
