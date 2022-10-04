import React from 'react';

const FeaturedInventoryReviews = ({ featuredItemReviews }) => {
  return (
    (featuredItemReviews && featuredItemReviews.length > 0) ?
      <div className='review-outer-box'>
        <h2 style={{ textAlign: 'center', marginTop: '0' }}>Reviews</h2>
        <div className='review-container'>
          {
            featuredItemReviews.map(review => {
              return (
                (review.isActive) ?
                  <div key={review.id} className='indiv-reviews'>
                    <h2>Rating: {review.stars}/5</h2>
                    <p>{review.description}</p>
                    <p className='smaller-details' style={{alignSelf:'flex-end'}}>User: {review.username}</p>
                  </div> :
                  null
              )
            })
          }
        </div>
      </div> :
      <div>No reviews for this item.</div>
  )
}

export default FeaturedInventoryReviews