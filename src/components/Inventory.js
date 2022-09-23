import React from 'react';
import { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { fetchInventory } from '../utilities/apiCalls';

const Inventory = ({items, setItems, setFeaturedItem}) => {
    
    const history = useHistory();
    //have pics named with id
    ///can do a junction or by itself
    const handleItemClick = (event, item) => {
        event.preventDefault();
        setFeaturedItem(item);
        history.push(`/inventory/${item.id}`)

    }

    useEffect(() => {
        (async () => {
            const inventory = await fetchInventory();
            setItems(inventory);
            console.log(inventory)
        })()
    }, [])

    return <>
        <h2> Inventory </h2>
        <div className="inventory-container">
            {
                (items && items.length > 0) ?
                items.map((item) => {
                    return (
                        <div 
                            key={item.id} 
                            className="item-box" 
                            onClick={(event) => { 
                                handleItemClick(event, item)
                        }}>
                            {
                                (item.image) ?
                                <img src={require(`${item.image}`)} className='inventory-img'/> :
                                null
                            }
                            <div className='item-details'>
                                <h3 className='item-title'>{item.name}</h3><br/>
                                <p>${item.price}.00</p>
                                <div className='item-stars'></div>
                                <p>{item.description}</p>
                            </div>
                        </div>
                    )
                }) :
                <div>Nothing to display!</div>
            }
        </div>
    </>
}

// <img src={require('./images/cutting-board-1.png')}  alt={''}/>
export default Inventory

    //FOR ADMIN USE
    //<div>
        {/* //   <h2>Add to Inventory </h2> */}
           {/* <form  onSubmit> */}
           {/* <input
        //       required
        //       type='text'
        //       name='name'
        //       placeholder='Name Required'
        //       value={name}
        //       onChange={(event) => setName(event.target.value)}
        //     /> THEN DO INPUT FOR DESCRIPTION, PRICE, STOCK, ISCUSTOMIZABLE (MAYBE ADD A PICTURE) */}
        ///**NEED TO UPDATE STOCK AS WELL**    
        //</div> 