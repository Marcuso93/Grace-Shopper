import React, { useState, useEffect } from 'react'
import { postReview } from '../utilities/apiCalls';

const CreateReview = ({ user, token, isCreatingReview, setIsCreatingReview }) => {
  const [description, setDescription] = useState('');
  const [stars, setStars] = useState('');

  console.log('isCreatingReview.id', isCreatingReview.id)

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
    } else {
      setDescription('');
      // setStars('');
      setIsCreatingReview(false);
      // TODO: update reviews on page
    }
  }
  
    const handleCancel = (event) => {
      event.preventDefault();
      setIsCreatingReview(false);
      // setStars('');
      setDescription('');
    }
  
  return (
    isCreatingReview ?
    <div>
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