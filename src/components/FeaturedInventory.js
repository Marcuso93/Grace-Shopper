import React, { useState, useEffect } from "react";
import { useHistory, useParams } from "react-router-dom";
import { fetchReviewsByItemId, postNewItemToCart, fetchInventoryById, fetchCart } from "../utilities/apiCalls";
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
  const [cartItems, setCartItems] = useState([]);
  const [average, setAverage] = useState(0);

  const history = useHistory()
  const { itemId } = useParams();

  const handleClose = () => {
    setFeaturedItem(false);
    history.push("/inventory")
  }

  const handleAddToCart = async () => {
    if (quantity > featuredItem.stock) {
      alert(`For Item: ${featuredItem.name}, there are only ${featuredItem.stock} available.`)
      return
    }

    if (itemAlreadyInCart()) {
      alert(`This item is already in your cart. You can edit quantities of this item in the cart tab.`);
      setIsAddingToCart(false);
    } else {
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
  }

  const itemAlreadyInCart = () => {
    if (cartItems.length > 0 && cartItems.filter(item => {
      return item.inventoryId === featuredItem.id
    }).length > 0) {
      return true
    } else return false
  }

  useEffect(() => {
    (async () => {
      if (itemId) {
        const item = await fetchInventoryById(itemId);
        setFeaturedItem(item);
      }
      const getReviews = await fetchReviewsByItemId(itemId ? itemId : featuredItem.id);
      setFeaturedItemReviews(getReviews);
      if (user) {
        const cartItemCheck = await fetchCart({ userId: user.id, token });
        setCartItems(cartItemCheck);
        if (featuredItem.ratings && featuredItem.ratings.length > 0) {
          let total = 0;
          featuredItem.ratings.forEach(rating => {
            total += rating.stars
          })
          const average = Math.round((total / featuredItem.ratings.length) * 10) / 10;
          setAverage(average);
        }
      }
    })()
  }, [])

  return (
    <div className="featured-container">
      <div key={featuredItem.id} className="featuredInventory">
        {
          (featuredItem.image) ?
            <img src={featuredItem.image} className='featured-img' /> :
            null
        }
        <div className="featured-info">
          <h1>{featuredItem.name}</h1>
          <p>Description: {featuredItem.description}</p>
          <p>Price: ${featuredItem.price/100}</p>
          {
            (average > 0) ?
            <p>Rating: {average}/5</p> :
            <p>No ratings available for this item.</p>
          }
          {
            (featuredItem.isCustomizable) ?
              <p>This item is customizable upon request.</p> :
              null
          }
          <p>Stock Available: {featuredItem.stock}</p>
          {
            !user ?
              <p>You must be logged in to add this item to your cart or review this item.</p> :
              null
          }
          {
            (cartItems.length > 0 && itemAlreadyInCart()) ?
              <p>Note: This item is already in your cart. You can edit the quantity in the cart tab.</p> :
              (!isAddingToCart && !success && user) ?
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
                <span>How many do you want to add?
                  <input
                    required
                    type='number'
                    name='quantity'
                    style={{marginLeft: '1em', width: '3em'}}
                    placeholder='Quantity'
                    min='1'
                    max={featuredItem.stock}
                    value={quantity}
                    onChange={(event) => { setQuantity(event.target.value) }}
                  />
                </span>
                <button style={{ marginTop: '1em' }} onClick={(event => {
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
            user ?
            <button onClick={(event) => {
              event.preventDefault();
              setIsCreatingReview(featuredItem);
            }}> Add Review </button> :
            null
          }
          {
            !featuredItemReviews.length ?
            <div><br/>There are no reviews for this item.</div> :
              !seeReviews ?
                <button className='login-register-button' onClick={(event) => {
                  event.preventDefault();
                  setSeeReviews(true);
                }}>See Reviews...</button> :
                <button className='login-register-button' onClick={(event) => {
                  event.preventDefault();
                  setSeeReviews(false);
                }}>Hide Reviews...</button>
          }
        </div>
        <button onClick={handleClose}> Back </button> <br/>
      </div>
      <div>
        {
          (seeReviews) ?
            <FeaturedInventoryReviews featuredItemReviews={featuredItemReviews} /> :
            null
        }
      </div>
    </div>
  )
}

export default FeaturedInventory