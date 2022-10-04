import React from "react";


const Home = () => {
  return <div className="home-container">
    <h1 className="page-titles">Welcome</h1>
    <div className="container">

      <input type="radio" id="i1" name="images" />
      <input type="radio" id="i2" name="images" />
      <input type="radio" id="i3" name="images" />
      <input type="radio" id="i4" name="images" />
      <input type="radio" id="i5" name="images" />

      <div className="slide_img" id="one">

        <img src='/images/cutting-board-1.png' alt={''} />

        <label className="prev" htmlFor="i5"><span>&#x2039;</span></label>
        <label className="next" htmlFor="i2"><span>&#x203a;</span></label>

      </div>

      <div className="slide_img" id="two">

        <img src='/images/mini-bar.png' alt={''} />

        <label className="prev" htmlFor="i1"><span>&#x2039;</span></label>
        <label className="next" htmlFor="i3"><span>&#x203a;</span></label>

      </div>

      <div className="slide_img" id="three">
        <img src='/images/yoda.png' alt={''} />

        <label className="prev" htmlFor="i2"><span>&#x2039;</span></label>
        <label className="next" htmlFor="i4"><span>&#x203a;</span></label>
      </div>

      <div className="slide_img" id="four">
        <img src="/images/table-4.png" alt={''} />

        <label className="prev" htmlFor="i3"><span>&#x2039;</span></label>
        <label className="next" htmlFor="i5"><span>&#x203a;</span></label>
      </div>

      <div className="slide_img" id="five">
        <img src='/images/yin-yang.png' alt={''} />

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
    <div className="statement">
      <p>As woodworkers, we design hand built, unique items that capture the beauty of the woodgrains and color to create functional and aesthetic works.</p> 
      <p>With the use of CNC machining, laser cutting, and epoxy we are able to customize even further to suit your desires.</p>
      <p>Woodworking is an art where a tree never dies!</p>
    </div>
  </div>
}

export default Home