import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { fetchReviewsByItemId } from "../utilities/apiCalls";

const FeaturedInventory = ({featuredItem, setFeaturedItem, setIsCreatingReview}) => {
  const [featuredItemReviews, setFeaturedItemReviews] = useState([]);
  const history = useHistory()

  const handleClose = () => {
    setFeaturedItem("")
    history.push("/inventory")
  }
    
  useEffect(() => {
    (async () => {
      const getReviews = await fetchReviewsByItemId(featuredItem.id);
      setFeaturedItemReviews(getReviews);
    })()
  }, [])

  return (
    <div key={featuredItem.id} className="featuredInventory">
      <h1>{featuredItem.name}</h1>
      {/* Add everything else */}
      <h3>Reviews</h3>
      {
        (featuredItemReviews && featuredItemReviews.length > 0) ?
        featuredItemReviews.map(review => {
          return (
            (review.isActive) ?
            <div key={review.id}>
              <h3>User: {review.username}</h3>
              {/* Map over review.stars here */}
              <p>{review.description}</p>
            </div> :
            null
          )
        }) :
        <div>No reviews for this item.</div>
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