import React, { useState, useEffect } from 'react'
import { postReview } from '../utilities/apiCalls';

const CreateReview = ({ user, token, isCreatingReview, setIsCreatingReview, featuredItemReviews, setFeaturedItemReviews }) => {
  const [description, setDescription] = useState('');
  // TODO: figure out stars
  const [stars, setStars] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();

    const newReview = await postReview(token, { 
      userId: user.id, 
      username: user.username, 
      itemId: isCreatingReview.id, 
      stars: 5, 
      description 
    });
    
    if (newReview.message){
      alert(`${newReview.message}`)
    } if (newReview.id) {
      if (featuredItemReviews && featuredItemReviews.length > 0) {
        setFeaturedItemReviews([newReview, ...featuredItemReviews])
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
        {/* TODO: stars */}
        <div>Handle Stars</div>
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