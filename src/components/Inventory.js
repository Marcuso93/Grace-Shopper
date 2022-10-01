import React from 'react';
import { useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { fetchInventory, deactivateInventory, fetchInventoryForAdmin } from '../utilities/apiCalls';
import { filterOutOldVersion } from '../utilities/utils';

const Inventory = ({ user, token, items, setItems, setFeaturedItem, setUpdatingInventory }) => {
  const history = useHistory();

  useEffect(() => {
    (async () => {
      if (user.isAdmin) {
        const inventory = await fetchInventoryForAdmin();
        setItems(inventory)
      } else {
        const inventory = await fetchInventory();
        console.log(inventory)
        setItems(inventory);
      }
    })()
  }, [user])

  const handleItemClick = (event, item) => {
    event.preventDefault();
    setFeaturedItem(item);
    history.push(`/inventory/${item.id}`)
  }

  const handleDelete = async (e, Id) => {
    // TODO: how to reactivate item
    e.stopPropagation()
    if (window.confirm("Are you sure you want to deactivate this inventory?")) {
      const deactivatedItem = await deactivateInventory(Id, token);
      setItems([deactivatedItem, ...filterOutOldVersion(items, deactivatedItem)])
    }
    history.push(`/inventory/`)
  }

  const handleEdit = async (e, item) => {
    e.preventDefault();
    e.stopPropagation();
    setUpdatingInventory(item);
  }

  return <>
    <h2> Inventory </h2>
    <div className="inventory-container">
      {
        (items && items.length > 0) ?
          items.map((item) => {
            let total = 0;
            item.ratings.forEach(rating => {
              total += rating.stars
            })
            const average = Math.round((total/item.ratings.length) * 10) / 10; 
            return (
              <div
                key={item.id}
                className="item-box"
                onClick={(event) => {
                  handleItemClick(event, item)
              }}>
              {
                (item.image) ?
                <img src={require(`${item.image}`)} className='inventory-img' /> :
                null
              }
              <div className='item-details'>
                <h3 className='item-title'>{item.name}</h3><br />
                {
                  (user && user.isAdmin && !item.isActive) ?
                  <div>This item is inactive.</div> :
                  null
                } 
                {
                  (average) ?
                  <p>Rating: {average}/5</p> :
                  <p>No rating available.</p>
                } 
                <p>Price: ${item.price}.00</p>
                <div className='item-stars'></div>
                <p>{item.description}</p>
                {
                  (user && user.isAdmin && token) ?
                  <>
                    {
                      item.isActive ?
                        <button className="delete" onClick={(e) => handleDelete(e, item.id)}>Deactivate Item</button> :
                        null
                    }
                    <button className="edit" onClick={(e) => handleEdit(e, item)}>{item.isActive ? 'Edit Item' : 'Edit/Activate Item'}</button>
                  </> :
                  null
                }
              </div>
            </div>
          )
        }) :
        <div>Nothing to display!</div>
      }
    </div>
  </>
}

export default Inventory