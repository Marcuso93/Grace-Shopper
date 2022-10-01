import React, { useState } from 'react';
import { postInventory } from '../utilities/apiCalls';

const CreateInventory = ({user, token, isCreatingInventory, setIsCreatingInventory, items, setItems}) => {
  const [name, setName] = useState('');
  const [image, setImage] = useState('');   // image path
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState(0);
  const [stock, setStock] = useState(0);
  const [isCustomizable, setIsCustomizable] = useState(false);
  const [isActive, setIsActive] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    const createdInventory = await postInventory(token, {
      name,
      image,
      description,
      price,
      purchasedCount: 0,
      stock,
      isActive,
      isCustomizable
    })

    if (createdInventory.message) {
      alert(`Error: ${createdInventory.message}`);
    } else if (createdInventory.id) {
      resetState();
      setItems([createdInventory, ...items]);
      setIsCreatingInventory(false);
    } else {
      alert('There was an error in creating this piece of inventory.')
    }
  }

  const handleCancel = async (event) => {
    event.preventDefault();
    resetState();
    setIsCreatingInventory(false);
  }

  const resetState = () => {
    setName('');
    setImage('');
    setDescription('');
    setPrice(0);
    setStock(0);
    setIsCustomizable(false);
    setIsActive(true);
  }

  if (user && user.isAdmin) {
    return (
      (isCreatingInventory) ?
      <div className="update-create-inventory">
        <form onSubmit={ handleSubmit }>
          <h3>Create New Inventory</h3>
          <div>Name:</div>
          <input
            required
            type='text'
            name='name'
            placeholder='Name Required'
            value = {name}
            onChange = {(event) => setName(event.target.value)}
          />
          <div>Image:</div>
          <input
            type='text'
            name='image'
            placeholder='Image Path'
            value={image}
            onChange={(event) => setImage(event.target.value)}
          />
          <div>Description:</div>
          <textarea
            required
            name='Description'
            placeholder='Description Required'
            rows='5'
            cols='1'
            value={description}
            onChange={(event) => setDescription(event.target.value)}
          />
          <div>Price:</div>
          <input
            required
            type='text'
            name='price'
            placeholder='Price Required'
            value={price}
            onChange={(event) => setPrice(Number(event.target.value))}
          />
          <div>Stock:</div>
          <input
            required
            type='number'
            name='stock'
            placeholder='Stock Required'
            min='1'
            value={stock}
            onChange={(event) => setStock(event.target.value)}
          />
          <label>This item is customizable: 
            <input
              type='checkbox'
              checked={isCustomizable}
              onChange={(event) => {
                event.preventDefault();
                setIsCustomizable(!isCustomizable);
          }}/></label>
          <label>Make this item active:
            <input
              type='checkbox'
              checked={isActive}
              onChange={(event) => {
                event.preventDefault();
                setIsActive(!isActive)
          }}/></label>
          <button type='submit'>Submit</button>
          <button
            type='button'
            onClick={(event) => handleCancel(event)}
          >Cancel</button>
        </form>
      </div> :
      <button 
        className='create-inventory-button'
        onClick={(event) => {
          event.preventDefault();
          setIsCreatingInventory(true);
        }}>Create Inventory</button> 
    )
  } else return null
}

export default CreateInventory 