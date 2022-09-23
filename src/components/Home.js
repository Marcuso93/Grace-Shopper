import React from "react";


const Home = () => {
  return <>
    <div className="container">

      <input type="radio" id="i1" name="images" />
      <input type="radio" id="i2" name="images" />
      <input type="radio" id="i3" name="images" />
      <input type="radio" id="i4" name="images" />
      <input type="radio" id="i5" name="images" />

      <div className="slide_img" id="one">

        <img src={require('./images/cutting-board-1.png')}  alt={''} />

        <label className="prev" htmlFor="i5"><span>&#x2039;</span></label>
        <label className="next" htmlFor="i2"><span>&#x203a;</span></label>

      </div>

      <div className="slide_img" id="two">

        <img src={require('./images/cutting-board-8.png')} alt={''} />

        <label className="prev" htmlFor="i1"><span>&#x2039;</span></label>
        <label className="next" htmlFor="i3"><span>&#x203a;</span></label>

      </div>

      <div className="slide_img" id="three">
        <img src={require('./images/cutting-board-3.png')} alt={''} />

        <label className="prev" htmlFor="i2"><span>&#x2039;</span></label>
        <label className="next" htmlFor="i4"><span>&#x203a;</span></label>
      </div>

      <div className="slide_img" id="four">
        <img src={require('./images/cutting-board-4.png')} alt={''} />

        <label className="prev" htmlFor="i3"><span>&#x2039;</span></label>
        <label className="next" htmlFor="i5"><span>&#x203a;</span></label>
      </div>

      <div className="slide_img" id="five">
        <img src={require('./images/cutting-board-5.png')} alt={''} />

        <label className="prev" htmlFor="i4"><span>&#x2039;</span></label>
        <label className="next" htmlFor="i1"><span>&#x203a;</span></label>

      </div>

      <div id="nav_slide">
        <label htmlFor="i1" className="dots" id="dot1"></label>
        <label htmlFor="i2" className="dots" id="dot2"></label>
        <label htmlFor="i3" className="dots" id="dot3"></label>
        <label htmlFor="i4" className="dots" id="dot4"></label>
        <label htmlFor="i5" className="dots" id="dot5"></label>
      </div>

    </div>
  </>
}


export default Home