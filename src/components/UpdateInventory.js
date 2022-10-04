import React, { useState } from "react";
import { patchInventory } from '../utilities/apiCalls'
import { filterOutOldVersion } from "../utilities/utils";

const UpdateInventory = ({ user, token, updatingInventory, setUpdatingInventory, items, setItems }) => {
  const [name, setName] = useState(updatingInventory.name);
  const [image, setImage] = useState(updatingInventory.image);   // image path
  const [description, setDescription] = useState(updatingInventory.description);
  const [price, setPrice] = useState(updatingInventory.price);
  const [stock, setStock] = useState(updatingInventory.stock);
  const [isCustomizable, setIsCustomizable] = useState(updatingInventory.isCustomizable);
  const [isActive, setIsActive] = useState(updatingInventory.isActive);
  const [purchasedCount, setPurchasedCount] = useState(updatingInventory.purchasedCount);

  const handleSubmit = async (event, itemId) => {
    event.preventDefault();
    event.stopPropagation();

    const updatedInventory = await patchInventory(itemId, {
      name,
      image,
      description,
      price,
      purchasedCount,
      stock,
      isActive,
      isCustomizable
    }, token);

    if (updatedInventory.message) {
      alert(`Error: ${updatedInventory.message}`);
    } else if (updatedInventory.id) {
      setItems([updatedInventory, ...filterOutOldVersion(items, updatedInventory)]);
      setUpdatingInventory(false);
    } else {
      alert('There was an error in creating this piece of inventory.')
    }
  }

  const handleCancel = async (event) => {
    event.preventDefault();
    setUpdatingInventory(false);
  }

  return (
    (user && user.isAdmin && updatingInventory) ?
    <div className="update-create-inventory">
      <form className='large-forms' onSubmit={(event) => handleSubmit(event, updatingInventory.id) }>
        <h3>Update Inventory</h3>
        <div>Name:</div>
        <input
          required
          type='text'
          name='name'
          placeholder='Name Required'
          defaultValue={updatingInventory.name}
          value={name}
          onChange={(event) => setName(event.target.value)}
        />
        <div>Image:</div>
        <input
          type='text'
          name='image'
          placeholder='Image Path'
          defaultValue={updatingInventory.image}
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
          defaultValue={updatingInventory.description}
          value={description}
          onChange={(event) => setDescription(event.target.value)}
        />
        <div>Price:</div>
        <input
          required
          type='text'
          name='price'
          placeholder='Price Required'
          defaultValue={updatingInventory.price}
          value={price}
          onChange={(event) => setPrice(Number(event.target.value))}
        />
        <div>Stock:</div>
        <input
          required
          type='number'
          name='stock'
          placeholder='Stock Required'
          defaultValue={updatingInventory.stock}
          value={stock}
          onChange={(event) => setStock(event.target.value)}
        />
        <div>Purchased Count:</div>
        <input 
          required
          type='number'
          name='purchasedCount'
          placeholder='Purchased Count Required'
          defaultValue={updatingInventory.purchasedCount}
          value={purchasedCount}
          onChange={(event) => setPurchasedCount(event.target.value)}
        />
        <label>This item is customizable:
          <input
            type='checkbox'
            defaultChecked={updatingInventory.isCustomizable}
            onChange={(event) => {
              event.preventDefault();
              setIsCustomizable(!isCustomizable);
            }} /></label>
        <label>Make this item active:
          <input
            type='checkbox'
            defaultChecked={updatingInventory.isActive}
            onChange={(event) => {
              event.preventDefault();
              setIsActive(!isActive)
            }} /></label>
        <button type='submit'>Submit</button>
        <button
          type='button'
          onClick={(event) => handleCancel(event)}
        >Cancel</button>
      </form>
    </div> :
    null
  )
}

export default UpdateInventory