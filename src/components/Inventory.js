import React from 'react';
import { useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { fetchInventory, deactivateInventory, fetchInventoryForAdmin } from '../utilities/apiCalls';
import { filterOutOldVersion } from '../utilities/utils';

const Inventory = ({ user, token, items, setItems, setFeaturedItem, setUpdatingInventory, isCreatingInventory }) => {
  const history = useHistory();

  useEffect(() => {
    (async () => {
      if (user.isAdmin) {
        const inventory = await fetchInventoryForAdmin();
        setItems(inventory)
      } else {
        const inventory = await fetchInventory();
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
    if (!isCreatingInventory) {
      setUpdatingInventory(item);
    }
  }

  return <>
    <div className="inventory-container">
      <h2 className='page-titles'> Inventory </h2>
      {
        (items && items.length > 0) ?
          items.map((item) => {
            let total = 0;
            let average = 0;
            if (item.ratings && item.ratings.length > 0) {
              item.ratings.forEach(rating => {
                total += rating.stars
              })
              average = Math.round((total / item.ratings.length) * 10) / 10;
            }
            return (
              <div
                key={item.id}
                className="item-box"
                onClick={(event) => {
                  handleItemClick(event, item)
                }}>
                {
                  (item.image) ?
                    <img src={item.image} className='inventory-img' /> :
                    null
                }
                <div className='item-details'>
                  <h3 className='item-title'>{item.name}</h3>
                  <p style={{ marginBottom: '1em' }}>{item.description}</p>
                  {
                    (user && user.isAdmin && !item.isActive) ?
                      <p className='smaller-details'>This item is inactive.</p> :
                      null
                  }
                  {
                    (average > 0) ?
                      <p className='smaller-details'>Rating: {average}/5</p> :
                      <p className='smaller-details'>No rating available.</p>
                  }
                  <p className='smaller-details'>Price: ${item.price / 100}</p>
                  {
                    item.stock > 0 ?
                      <p className='smaller-details'>In stock: {item.stock}</p> :
                      <p className='smaller-details' style={{ color: 'red' }}>Sorry, this item is out of stock!</p>
                  }
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