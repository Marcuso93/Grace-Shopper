import React, { useEffect, useState } from 'react';
import { fetchAllOrders, fetchUserOrders, getLocalUser } from "../utilities/apiCalls"
import { checkLocalStorage } from '../utilities/utils';

const Orders = ({ user, setUser, token, setToken }) => {
  const [orders, setOrders] = useState([]);

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
      let getOrders;
      if (user) {
        if (user.isAdmin) {
          getOrders = await fetchAllOrders();
        } else if (user.id) {
          getOrders = await fetchUserOrders(token, user.id);
        }

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

  if (user && user.isAdmin) {
    return (
      <div className='admin-orders'>
        <div className='page-titles'>Orders</div>
        {
          (orders && orders.length > 0) ?
            orders.map((order) => {
              const date = new Date(Number(order.orderDate));
              return (
                <div key={order.id} className="admin-indiv-orders">
                  <div className='order-info'>
                    <h3>Order ID: {order.id}</h3>
                    <div>Username: {order.user.username}</div><br/>
                    <div>Address: {order.user.address}</div>
                    <div>Email: {order.user.email}</div><br/>
                    <div>Order Date: {date.toLocaleString()}</div>
                    <div>Order Price: ${order.price / 100}</div>
                  </div>
                  <div className='orders-right-side'>
                    {
                      (order.items && order.items.length > 0) ?
                        <>
                          <h3>Items in Order</h3>
                          <div className='items-container'>
                            {
                              order.items.map((item) => {
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
              )
            }) :
            null
        }
      </div>
    )
  } else {
    return (
      (user && token) ?
        <div className='user-order-container'>
          <div className='page-titles'>Orders History</div>
          {
            (orders && orders.length > 0) ?
              orders.map((order) => {
                const date = new Date(Number(order.orderDate));
                return (
                  <div key={order.id} className="orders">
                    <h3>Order ID: {order.id}</h3>
                    <div>Order Date: {date.toLocaleString()}</div>
                    <div>Price: ${order.price / 100}</div>
                    <div>
                      {
                        (order.items && order.items.length > 0) ?
                          order.items.map((item) => {
                            return (
                              <div key={item.cartInventoryId} className="">
                                <div className='order-item-box'>
                                  {
                                    (item.image) ?
                                      <img src={item.image} className='inventory-img' /> :
                                      null
                                  }
                                  <div className='order-details'>
                                    <div className='item-title'>{item.name}</div>
                                    <p>Price: ${item.price / 100}</p>
                                    <p>Quantity: {item.quantity}</p>
                                    <p>Description: {item.description}</p>
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
              <div className='orders'>
                <div>No orders to display.</div>
              </div>
          }
        </div> :
        <div className='inventory-container'>
          <div className='page-titles'>Orders History</div>
          <div className='orders'>You must be logged in to view your orders.</div>
        </div>
    )
  }
}

export default Orders