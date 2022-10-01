import React from 'react';

const FeaturedInventoryReviews = ({ featuredItemReviews }) => {
  return (
    <>
      {
        (featuredItemReviews && featuredItemReviews.length > 0) ?
        <>
          <h2 style={{textAlign: 'center', marginTop: '0'}}>Reviews</h2>
          <div className='review-container'>
            { 
              featuredItemReviews.map(review => {
              return (
                (review.isActive) ?
                  <div key={review.id} className='indiv-reviews'>
                    <p>Rating: {review.stars}/5</p>
                    <p>{review.description}</p>
                    <p>User: {review.username}</p>
                  </div> :
                  null
              )})
            }
          </div>
        </> :
        <div>No reviews for this item.</div>
      }
    </>
  )
}

export default FeaturedInventoryReviews