import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import Loader  from '../../components/Loader.js'
import Message from '../../components/Message.js'
import Header from '../../components/Header'
import Footer from '../../components/Footer'
import '../../css/products.css'
import { Checkbox } from 'primereact/checkbox';
import pimg1 from '../../images/imgae/apple.png';
import pimg2 from '../../images/imgae/chili.png';
import pimg3 from '../../images/imgae/onion.png';
import pimg4 from '../../images/imgae/patato.png';
import pimg5 from '../../images/imgae/garlic.png';
import pimg6 from '../../images/imgae/tamato.png';
import { listProducts } from '../../actions/productAction'
import { listCategories } from '../../actions/categoryAction'
import { Form } from 'react-bootstrap';

const AllProductsScreen = ({ match }) => {
    
    const keyword = match.params.keyword
   const [cities, setCities] = useState([]);


    const [productType, setProductType] = useState('All')

    const dispatch = useDispatch()
    

    const categoryList = useSelector(state => state.categoryList) 
    const { loading: loadingcat, error: errorCat, categories}  = categoryList
//     cities = categories

//     const onCityChange = (e) => {
//     const selectedCities = [...cities];
//     if(e.checked)
//         selectedCities.push(e.value);
//     else
//         selectedCities.splice(selectedCities.indexOf(e.value), 1);

//     setCities(selectedCities);
// }

    const productList = useSelector(state => state.productList) 
    const { loading, error, products} = productList
    
    useEffect(() => {
     dispatch(listCategories())
     dispatch(listProducts(keyword))
     
    }, [dispatch, keyword])
    return (
       <>
            <Header />
             {errorCat && <Message variant='danger'>{errorCat}</Message>}
            {loadingcat && <Loader/>}
             {error && <Message variant='danger'>{error}</Message>}
            {loading ? ( <Loader /> ) : error ? (<Message variant='danger'>{error}</Message>) : (
          <div className="all-products-page">
             <div className="all-products-page-con">
                <div className="containter-pro-1">
                   <div className="containter-pro-1-title"><h3>Category</h3></div>
                   <div className="containter-pro-1-body">
                        <div className="p-grid  p-mt-4 p-mb-5">
                                    <div className="p-col-12">
                                            {categories.map(category => (
                                            <div key={category.id} >
                                            <div class="custom-control custom-checkbox">
                                            <input type="checkbox" class="custom-control-input" id="defaultUnchecked"/>
                                             <label class="custom-control-label p-ml-2" for="defaultUnchecked">{category.name}</label>
                                                    </div>
                                                    </div>
                                            ))}
                                    </div>
                      </div>
                   </div>
                </div> 
                <div className="containter-pro-2">
                   <h3>Products</h3>
                        <div class="product-container">
                            {products.map(product => (
                                <div class="product-box">
                                <Link to={`/product/${product.id}`} className="add-cart">
                                         <img alt="apple" src={product.image} />
                                    </Link> 
                                    <Link to={`/product/${product.id}`} className="add-cart">
                                    <strong>{product.name}</strong>
                                    </Link>
                                    <span class="price">{product.price}$</span>
                                    <Link to={`/product/${product.id}`} className="add-cart">
                                        <a href="#" class="cart-btn">
                                        <i class="fas fa-shopping-bag"></i> Add Cart
                                         </a>
                                    </Link>
                                    <a href="#" class="like-btn">
                                        <i class="far fa-heart"></i>
                                    </a>
                                </div>
                            ))}
        </div>
                </div>
             </div>
          </div>
            )} 
          <Footer/>
           </>
                    
    )
}

export default AllProductsScreen
