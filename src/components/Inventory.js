import React from "react";
//import {images} from "./images"

const Inventory = () => {

    //have pics named with id
    ///can do a junction or by itself
    let images = []
    for(let i =0; i < images.length; i++) {
        let image = `./images/cutting-board-${i}.png` 
        images.push(image)
        console.log(image)
    }
    console.log(images)
  return <>
    <h2> Inventory </h2>
        <div className="inventory-container">
            {
            images.map((img) => {
            return <div key ={img.id}>
                <img src={img} alt={img}/>
                </div>
            })
        }
        </div>
  </>
}

// <img src={require('./images/cutting-board-1.png')}  alt={''}/>
export default Inventory