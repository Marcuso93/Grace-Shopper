import React, { useEffect, useState } from 'react';
import { fetchUserOrders, getLocalUser } from "../utilities/apiCalls"
import { checkLocalStorage } from '../utilities/utils';

const Orders = ({ user, setUser, token, setToken }) => {
  const [orders, setOrders] = useState([]);
  
  // console.log('user', user)

  useEffect(() => {
    (async () => {
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
        const getOrders = await fetchUserOrders(token, user.id);

        if (getOrders.message && getOrders.message == 'No order history to display.') {
          return
        } else if (getOrders.message) {
          alert(`Error: ${getOrders.message}`)
        } else {
          setOrders(getOrders)
        }
      } else {
        console.log("No user.id")
      }
    })()
  }, [user.id])

  return (
    // TODO: when you log out, orders should go away
    (token) ?
    <div className='inventory-container'>
      <div className='orderHistory'>Orders History</div>
      {
        (orders && orders.length > 0) ?
        orders.map((order) => {
          const date = new Date(Number(order.orderDate));
          return (
            <div key={order.id} className="orders">
              <div>Order ID: {order.id}</div>
              <div>Order Date: {date.toLocaleString()}</div>
              <div>Price: ${order.price}.00</div>
              <div>
                {
                  (order.items && order.items.length > 0) ?
                  order.items.map((item) => {
                    return (
                      <div key={item.cartInventoryId} className= "inventory-container">
                        <div className='item-box'>
                        {
                          (item.image) ?
                          <img src={require(`${item.image}`)} className='inventory-img' /> :
                          null
                        }
                        <div className='order-box'>
                        <div className='item-title'>{item.name}</div>
                        <div>Price: ${item.price}.00</div>
                        <div>Description: {item.description}</div>
                        </div>
                        </div>
                      </div>
                    )
                  }) :
                  null
                }
              </div>
            </div>
          )
        }) :
        null
      }
    </div> :
    null
  )
}

export default Orders