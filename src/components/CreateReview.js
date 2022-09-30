import React, { useState, useEffect } from 'react'
import { postReview } from '../utilities/apiCalls';

const CreateReview = ({ user, token, isCreatingReview, setIsCreatingReview, featuredItemReviews, setFeaturedItemReviews }) => {
  const [description, setDescription] = useState('');
  // TODO: figure out stars
  const [stars, setStars] = useState(5);

  const handleSubmit = async (event) => {
    event.preventDefault();

    const newReview = await postReview(token, { 
      userId: user.id, 
      username: user.username, 
      itemId: isCreatingReview.id, 
      stars, 
      description 
    });
    
    if (newReview.message){
      alert(`${newReview.message}`)
    } if (newReview.id) {
      if (featuredItemReviews && featuredItemReviews.length > 0) {
        setFeaturedItemReviews([newReview, ...featuredItemReviews])
        // TODO: update inventory page as well
      }
      resetState();
    } else {
      alert('There was an error in creating your review.')
    }
  }
  
  const handleCancel = (event) => {
    event.preventDefault();
    resetState();
  }
  
  const resetState = () => {
    setDescription('');
    setStars('');
    setIsCreatingReview(false);
    }
  
  return (
    isCreatingReview ?
    <div className='create-review-popup'>
      <form onSubmit={ handleSubmit }>
        <h3>Create a Review</h3>
        {/* TODO: fix this stuff */}
        <div>Rating:</div>
        <input
          required
          type='number'
          min='1'
          max='5'
          name='stars'
          placeholder='Rating Required'
          value={stars}
          onChange={(event) => setStars(event.target.value)}
        />
        <textarea 
          name='description'
          placeholder='Review'
          rows='5'
          cols='1'
          value={description}
          onChange={(event) => { setDescription(event.target.value) }}
        />
        <button type='submit'>Submit</button>
        <button 
          name='cancel-button'
          onClick={(event) => { handleCancel(event) }}>
            Cancel
          </button>
      </form>
    </div> :
    null
  )

}

export default CreateReview