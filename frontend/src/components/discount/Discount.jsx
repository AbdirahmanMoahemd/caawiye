import React from "react"
import Dcard from "./Dcard"
import "./style.css"

const Discount = ({ productItems }) => {
  return (
    <>
      <section className='flash'>
        <div className='container'>
          <div className='heading f_flex'>
            <i class="fa-solid fa-percent"></i>
            <h1>Big Discounts</h1>
          </div>
          
            <Dcard productItems={productItems} />
        </div>
      </section>
    </>
  )
}

export default Discount
