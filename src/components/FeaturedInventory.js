import React, { useState, useEffect } from "react";
import { useHistory, useParams } from "react-router-dom";
import { fetchReviewsByItemId, postNewItemToCart, fetchInventoryById } from "../utilities/apiCalls";
import FeaturedInventoryReviews from "./FeaturedInventoryReviews";

const FeaturedInventory = ({
  user,
  token,
  featuredItem, 
  setFeaturedItem, 
  setIsCreatingReview, 
  featuredItemReviews, 
  setFeaturedItemReviews
}) => {
  const [seeReviews, setSeeReviews] = useState(false);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [success, setSuccess] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const history = useHistory()

  const { itemId } = useParams();

  const handleClose = () => {
    setFeaturedItem("")
    history.push("/inventory")
  }

  const handleAddToCart = async () => {
    // alert if more quantity than stock
    if (quantity > featuredItem.stock) {
      alert(`For Item: ${featuredItem.name}, there are only ${featuredItem.stock} available.`)
      return 
    }
    // TODO: get inventory IDs from users cart to double check they don't already have this item in the cart
    const itemAdded = await postNewItemToCart(token, { 
      userId: user.id,
      inventoryId: featuredItem.id,
      quantity,
      price: featuredItem.price
    })
    if (itemAdded.message) {
      alert(`Error: ${itemAdded.message}`)
    } else if (itemAdded.id) {
      setSuccess(true);
      setIsAddingToCart(false);
    } else {
      alert('There was a problem adding this item to your cart.')
    }
  }
    
  useEffect(() => {
    (async () => {
      if (itemId) {
        const item = await fetchInventoryById(itemId);
        setFeaturedItem(item);
      }
      const getReviews = await fetchReviewsByItemId(itemId ? itemId : featuredItem.id);
      setFeaturedItemReviews(getReviews);
    })()
  }, [])

  return (
    <div key={featuredItem.id} className="featuredInventory">
      <h1>{featuredItem.name}</h1>
      {
        (featuredItem.image) ?
        <img src={require(`${featuredItem.image}`)} className='inventory-img' /> :
        null
      }
      <p>{featuredItem.description}</p>
      <p>Price: ${featuredItem.price}.00</p>
      {
        (featuredItem.isCustomizable) ?
        <p>This item is customizable upon request.</p> :
        null
      }
      <p>Stock Available: {featuredItem.stock}</p>
      {
        (!isAddingToCart && !success) ?
        <>
          <button onClick={(event => {
            event.preventDefault();
            setIsAddingToCart(true);
          })}>Add to Cart</button> <br />
        </> : 
        null
      }
      {
        (isAddingToCart) ?
        <>
          <span>How many do you want to add?</span>
          <input
            required
            type='number'
            name='quantity'
            placeholder='Quantity'
            value={quantity}
            onChange={(event) => { setQuantity(event.target.value) }}
          />
          <button onClick={(event => {
            event.preventDefault();
            handleAddToCart();
          })}>Add to Cart</button> <br />
        </> :
        null
      }
      {
        success ?
        <h3>This item has been added to your cart!</h3>         
        : null
      }
      {
        (!seeReviews) ?
        <button className='login-register-button' onClick={(event) => {
          event.preventDefault();
          setSeeReviews(true);
        }}>See Reviews...</button> :
        <button className='login-register-button' onClick={(event) => {
          event.preventDefault();
          setSeeReviews(false);
        }}>Hide Reviews...</button>
      }
      {
        (seeReviews) ?
        <FeaturedInventoryReviews featuredItemReviews={featuredItemReviews}/> :
        null
      }
      <button onClick={(event) => {
        event.preventDefault();
        setIsCreatingReview(featuredItem);
      }} > Add Review </button>
      <button onClick={handleClose}> Close </button>
    </div>
  )
}

export default FeaturedInventory