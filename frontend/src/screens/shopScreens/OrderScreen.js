import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { PayPalButton } from 'react-paypal-button-v2'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import Message from '../../components/Message'
import Loader from '../../components/Loader'
import { Button } from 'primereact/button';
import {
  getOrderDetails, 
  payOrder, 
  deliverOrder,
  payOrder2
} from '../../actions/orderActions'
import {
  ORDER_PAY_RESET, 
  ORDER_DELIVER_RESET,
  ORDER_DETAILS_RESET,
  ORDER_DETAILS_SUCCESS,
  ORDER_DETAILS_REQUEST,
  ORDER_PAY_RESET2,
} from '../../constants/orderConstants'
import Header from '../../components/Header'


const OrderScreen = ({ history, match }) => {
     const orderId = match.params.id

  const cart = useSelector((state) => state.cart)
    const { paymentMethod } = cart 
  const [sdkReady, setSdkReady] = useState(false)

  const dispatch = useDispatch()
    const orderDetails = useSelector((state) => state.orderDetails)
    const { order, loading, error } = orderDetails

  const orderPay = useSelector((state) => state.orderPay)
  const { loading: loadingPay, success: successPay } = orderPay
  
  const orderPay2 = useSelector((state) => state.orderPay2)
  const { loading: loadingPay2, success: successPay2 } = orderPay2

  const orderDeliver = useSelector((state) => state.orderDeliver)
  const { loading: loadingDeliver, success: successDeliver } = orderDeliver  

  const userLogin = useSelector((state) => state.userLogin)
  const { userInfo } = userLogin

  if (!loading) {
    //   Calculate prices
    const addDecimals = (num) => { 
      return (Math.round(num * 100) / 100).toFixed(2)
    } 

    order.itemsPrice = addDecimals(
      order.orderItems.reduce((acc, item) => acc + item.price * item.qty, 0)
    )
  }
  
      
  useEffect(() => {
    
    if (!userInfo) {
      history.push('/login')
    }
    const addPayPalScript = async () => {
      const { data: clientId } = await axios.get('/api/config/paypal')
      const script = document.createElement('script')
      script.type = 'text/javascript'
      script.src = `https://www.paypal.com/sdk/js?client-id=${clientId}`
      script.async = true
      script.onload = () => {
        setSdkReady(true)
      }
      document.body.appendChild(script)
    }

    if (!order || successPay || successPay2 || successDeliver) {
      dispatch({ type: ORDER_PAY_RESET })
      dispatch({ type: ORDER_PAY_RESET2 })
      dispatch({ type: ORDER_DELIVER_RESET })
      dispatch(getOrderDetails(orderId))
    } else if (!order.isPaid) { 
      if (!window.paypal) {
        addPayPalScript()
      } else {
        setSdkReady(true)
      }
    }
  }, [dispatch,history, orderId, successPay, successDeliver, order, userInfo, successPay2])
  const successPaymentHandler = (paymentResult) => {
    console.log(paymentResult)
    dispatch(payOrder(orderId, paymentResult))
  }
  const successPaymentHandler2 = () => {
     dispatch(payOrder2(orderId))
    
  }
  
  const deliverHandler = () => {
    dispatch(deliverOrder(order))
  }
  return (
    <>
      <Header />
      
      {loading ? (<Loader />) : error ? (<Message variant='danger'>{error}</Message>) :
        (
          <>
           <div className="cart-page-new">
          <div class="cart-page">
                            <div class="container-pages-cart">
                           
                                <div class="col-cart">
                                    <div>
                                        {/* <p-button
                                        label="Continue shopping"
                                        icon="pi pi-arrow-left"
                                        ></p-button> */}
                                    </div>
                                <div>
                             </div>
                        
                                        
                <div class="cart-item p-mb-5" >
                                                <div className="shipping-add">
                                                  <strong>Shipping</strong>
                                                    <span className="p-mt-2">
                                                <h4>name:{' '}{order.user.name}</h4>
                   <h4>Email:{' '}<a href={`mailto:${order.user.email}`}>{order.user.email}</a></h4>
                   <h4>Address:{' '} {' '}
                     {order.shippingAddress.address}, {order.shippingAddress.city},{' '}
                     {order.shippingAddress.phoneNumber},{' '}
                     {order.shippingAddress.country}</h4>
                   <h4>{order.isDelivered ? (
                     <Message variant='success'>
                       Delivered on {order.deliveredAt}
                     </Message>
                   ) : (
                       <Message variant='danger'>Not Delivered</Message>
                     )}</h4>
                                                  </span>
                                                <strong className="p-mt-2">Payment Method</strong>
                                                  <span className="p-mt-2">
                                                    <h4>Method:{' '} {' '}
                                                      {order.paymentMethod}</h4>
                                                    <h4>{order.isPaid ? (
                                                      <Message variant='success'>Paid on {order.paidAt}</Message>
                                                    ) : (
                                                        <Message variant='danger'>Not Paid</Message>
                                                      )}</h4>
                                            </span>
                    <strong  className="p-mt-3">Order Items</strong> 
                  </div>
                  {cart.cartItems.length === 0 ? (
                    <Message>Your cart is empty</Message>
                  ) : (
                    <>
                      {order.orderItems.map((item, index) => (
                        <>
                          <div class="p-grid p-fluid p-mt-2 order-box" key={index}>
                            <div class="p-col-4 p-md-4 p-lg-2 cart-item-image">
                              <img style={{ width: "100%", height: "100%" }} src={item.image} />
                            </div>
                            <div class="p-col-8 p-md-4 p-lg-3 ">
                              <div style={{ fontSize: '1.1rem', fontWeight: '600', marginBottom: '15px' }} class=" p-ml-3">name</div>
                              <div style={{ fontSize: '.9rem', fontWeight: '600', marginBottom: '15px' }} class=" p-ml-3">{item.name}</div>
                        
                            </div>
                            <div class="p-col-4 p-md-4 p-lg-3 p-fluid">
                                                        
                              <div style={{ fontSize: '1.1rem', fontWeight: '600', marginBottom: '15px' }} class=" p-ml-3">Quantity</div>
                              <div style={{ fontSize: '.9rem', fontWeight: '600', marginBottom: '15px' }} class=" p-ml-3">{item.qty} x ${item.price}</div>
                            </div>
                            <div class="p-col-8 p-md-4 p-lg-4 p-fluid">
                              <div style={{ fontSize: '1.1rem', fontWeight: '600', marginBottom: '15px' }} class=" p-ml-3">Total:</div>
                              <div style={{ fontSize: '.9rem', fontWeight: '600', marginBottom: '15px' }} class=" p-ml-3">${item.qty * item.price}</div>
                            </div>
                          </div>
                        </>
                      ))}
                    </>)}
                                            </div>
                                     
    </div>
    <div class="co">
                <div class="order-summary">
                     <center> <strong>Order Summary</strong></center>
                    <div class="summary-price">
                        <span>Items</span>
                         <span>${order.itemsPrice}</span>
                    </div>
                    <div class="summary-price"> 
                        <span>Packing & Shipping</span>
                        <span class="free">${order.shippingPrice}</span>
                    </div>
                    <div class="to-checkout">
                        <div class="summary-price">
                            <span>Total Price</span>
                            <span>${order.totalPrice}</span>
                        </div>
                     {order.paymentMethod === 'payPal' ?
                  <>
                    {!order.isPaid && (
                      <>
                        {loadingPay && <Loader />}
                        {!sdkReady ? (
                          <Loader />
                        ) : (
                            <PayPalButton
                              amount={order.totalPrice}
                              onSuccess={successPaymentHandler}
                            />
                          )}
                      </>
                    )}</> :
                          <>
                    
                            <center>
                              {userInfo && userInfo.isAdmin && !order.isPaid && !order.isDelivered && (
                                <>
                              <h3>Pay Options</h3>
                      <div className="payop">
                        <h4>Evc-Plus: +252 61 6132192</h4>
                        <h4>eDahab: +252 61 6132192</h4>
                        <h4>ZAAD: +252 61 6132192</h4>
                                  </div>
                                  </>
                     ) }
                      {loadingPay2 && <Loader />}
                              {userInfo && userInfo.isAdmin && !order.isPaid && !order.isDelivered && (
                                <div class="checkout-button" >
                            <Button label="Mark As Paid"   onClick={successPaymentHandler2}  />
                        </div>
                      )}
                    </center>
                  </>
                }
                {loadingDeliver && <Loader />}
                {userInfo && userInfo.isAdmin && order.isPaid && !order.isDelivered && (
                 <div class="checkout-button" >
                          <Button label=" Mark As Delivered" onClick={deliverHandler} />
                </div>
                )}
                {!order.isPaid && (
                  <>
                    {paymentMethod != order.paymentMethod ? <center><h4 style={{ color: 'red' }}>please refresh the page to see the changes you made</h4></center> : ''}
                  </>
                )}
                
                    {error && <Message variant='danger'>{error}</Message>}
                        
                    </div>
                </div>
           
    </div>
                                       
  </div> 
  
</div>
 
        </div>
          </>
        )} </> )
       
}

export default OrderScreen
