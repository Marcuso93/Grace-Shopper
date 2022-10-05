import React, { useState, useEffect } from 'react'
import { postReview } from '../utilities/apiCalls';
import { filterOutOldVersion } from '../utilities/utils';

const CreateReview = ({ 
  user, 
  token, 
  isCreatingReview, 
  setIsCreatingReview, 
  featuredItemReviews, 
  setFeaturedItemReviews,
  items,
  setItems,
  featuredItem,
  setFeaturedItem 
}) => {
  const [description, setDescription] = useState('');
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
      setFeaturedItemReviews(
        (featuredItemReviews && featuredItemReviews.length > 0) ?
        [newReview, ...featuredItemReviews] : 
        [newReview]
      )

      let newItem = {
        ...featuredItem
      }
      newItem.ratings.push({ stars });
      setItems([newItem, ...filterOutOldVersion(items, newItem)]);
      setFeaturedItem(newItem)

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
    setStars(5);
    setIsCreatingReview(false);
  }
  
  return (
    isCreatingReview ?
    <div className='create-review-popup'>
      <form className='large-form' onSubmit={ handleSubmit }>
        <h3>Create a Review</h3>
        <div>Rating: <input
          required
          type='number'
          min='1'
          max='5'
          name='stars'
          value={stars}
          onChange={(event) => { setStars(Number(event.target.value)) }}
        /></div>
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