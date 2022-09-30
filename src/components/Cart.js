import React, {useState, useEffect} from "react";
import { fetchCart, getLocalUser, postNewOrder, removeItemFromCart } from "../utilities/apiCalls";
import { checkLocalStorage, filterOutOldVersion } from "../utilities/utils";

// TODO:
// local storage for visitor cart
// update/remove items from cart
// Note: when removing item and updating on page can use fn filterOutOldVersion from utils

const Cart = ({user, setUser, token, setToken}) => {
  const [cartItems, setCartItems] = useState([]);
  const [cartPrice, setCartPrice] = useState(0);
  const [orderSuccess, setOrderSuccess] = useState(false);

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
        if (cart.message && cart.name !== 'EmptyCart' && cart.name !== 'undefined') {
          alert(`Error: ${cart.message}.`)
        }
        setCartItems(cart);
        setCartPrice(getPrice());
      } else {
        console.log("No user.id")
      }
    })()
  }, [user])

  const handleRemoveItem = async (event, item) => {
    // TODO: double check correct user to be able to remove from cart?
    event.preventDefault();
    event.stopPropagation();
    const removedItem = await removeItemFromCart(token, item.cartInventoryId);

    if (removedItem.message) {
      alert(`Error: ${removedItem.message}`);
    } else if (removedItem.id) {
      setCartItems(filterOutOldVersion(cartItems, item));
    } else {
      alert(`There was an error removing this item from your cart.`)
    }
  }

  const handlePlaceOrder = async (event) => {
    event.preventDefault();
    event.stopPropagation();
    // TODO get this to work
    setCartPrice(getPrice());
    const orderDate = new Date().getTime();

    const newOrder = await postNewOrder(token, { 
      userId: user.id, 
      price: cartPrice,
      orderDate
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
    // let arr = [];
    let totalPrice = 0;

    for (let i=0; i < cartItems.length; i++) {

      totalPrice += cartItems[i]['price']
    }
    // arr.reduce()
    // cartItems.forEach(item => {
    //   console.log('item!!!', item)
    //   // totalPrice += item.price;
    //   arr.push(item.price)
    // })
    // console.log(arr)

    return totalPrice
  }
 
  return (
    <div className="cart-background">
      <h2> Cart </h2>
      {
        orderSuccess ?
        <div>Your order was successfully placed. See the orders tab to review your order(s).</div>:
        null
      }
      {
        ((cartItems && cartItems.name === 'EmptyCart') || (cartItems && cartItems.length < 1)) ?
        <div>Your cart is empty!</div> :
        <button onClick={(event) => {
          handlePlaceOrder(event);
        }}>Place Order</button>
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
              <p>{(item.stock && item.stock > 0) ? `Items in stock : ${ item.stock }` : 'Out of stock!'}</p>
              <button onClick={(event) => {
                handleRemoveItem(event, item);
              }}>Remove</button>
            </div>
          )
        }):
        null
      }
    </div>
  )
}

export default Cart