import React from 'react';

const FeaturedInventoryReviews = ({ featuredItemReviews }) => {
  return (
    <>
      {
        (featuredItemReviews && featuredItemReviews.length > 0) ?
        <>
          <h2>Reviews</h2>
          { 
            featuredItemReviews.map(review => {
            return (
              (review.isActive) ?
                <div key={review.id}>
                  <h3>User: {review.username}</h3>
                  {/* Map over review.stars here */}
                  <p>{review.description}</p>
                </div> :
                null
            )})
          }
        </> :
        <div>No reviews for this item.</div>
      }
    </>
  )
}

export default FeaturedInventoryReviews