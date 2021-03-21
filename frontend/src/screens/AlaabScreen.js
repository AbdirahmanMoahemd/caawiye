import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import Rating from '../components/Rating'
import Loader from '../components/Loader'
import Message from '../components/Message'
import { listProducts2 } from '../actions/productAction'
import Products from '../components/Products'
import Header from '../components/Header'


const AlaabScreen = () => {
const [productType, setProductType] = useState('All')
    const dispatch = useDispatch()
    
  const productList = useSelector(state => state.productList)
  const { loading, error, products } = productList
    
 useEffect(() => {
        dispatch(listProducts2())
 }, [dispatch])
    console.log(productType)
    return (
       <>
          <Header/>
            {loading ? <Loader/> : error ? <Message variant='warning'>{error}</Message> :
            <div className="small-container">
         <div className="row row-2">
            <h2>Alaabta Guryaha</h2>
            
         </div>
            <div  className="prodcut-container">
            
                   {products.filter(product => product.category === 'alaab').map(filteredproduct => (
                
                  <div key={filteredproduct._id} className="product-box">
                    <Products product={filteredproduct} />
                    </div>
                         ))}
               
                    
                    </div>
            </div> 
            }
            <p className="wt">.</p> 
          <p className="wt">.</p>  
            
            </>
                    
    )
}

export default AlaabScreen
