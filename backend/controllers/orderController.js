import asyncHandler from 'express-async-handler'
import Order from '../models/oderModel.js'


// @desc    Create new order
// @route   POST /api/orders
// @access  Private
export const addOrderItems = asyncHandler(async (req, res) => {
  const {
    orderItems,
    shippingAddress,
    paymentMethod,
    itemsPrice,
    shippingPrice,
    totalPrice,
    date
  } = req.body

  if (orderItems && orderItems.length === 0) {
    res.status(400)
    throw new Error('No order items')
     return
  } else {
    const order = new Order({
      orderItems,
      user: req.user._id,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      shippingPrice, 
      totalPrice,
      date
    })

    const createdOrder = await order.save()

    res.status(201).json(createdOrder)
  }
})

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
export const getOrderById = asyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id).populate('user')
    if (order) {
        res.json(order)
    }
    else {
        res.status(404)
        throw new Error('Order not found')
    }
})



// @desc    Update order to paid
// @route   GET /api/orders/:id/pay
// @access  Private
export const updateOrderToPaid = asyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id)
    if (order) {
      order.isPaid = true
      order.paidAt = Date.now()
      order.paymentResult = {
        id: req.body.id,
        status: req.body.status,
        update_time: req.body.update_time,
        email_address: req.body.payer.email_address
      }
      const updatedOrder = await order.save() 
      
      res.json(updatedOrder)
    }
    else {
        res.status(404)
        throw new Error('Order not found')
    }
})

// @desc    Update order to paid
// @route   GET /api/orders/:id/pay
// @access  Private
export const updateOrderToPaid2 = asyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id)
    if (order) {
      order.isPaid = true
      order.paidAt = Date.now()
      // order.paymentResult = {
      //   id: req.body.id,
      //   status: req.body.status,
      //   update_time: req.body.update_time,
      //   phoneNumber: req.body.phoneNumber
      // }
      const updatedOrder = await order.save() 
      
      res.json(updatedOrder)
    }
    else {
        res.status(404)
        throw new Error('Order not found')
    }
})


// @desc    Update order to delivered
// @route   GET /api/orders/:id/deliver
// @access  Private/Admin
export const updateOrderToDelivered = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id)

  if (order) {
    order.isDelivered = true
    order.deliveredAt = Date.now()

    const updatedOrder = await order.save()

    res.json(updatedOrder)
  } else {
    res.status(404)
    throw new Error('Order not found')
  }
})




// @desc    Get logged in user orders
// @route   GET /api/orders/myorders
// @access  Private
export const getMyOrders = asyncHandler(async (req, res) => {
    const orders = await Order.find({ user: req.user._id })
    res.json(orders)
})

// @desc    Get logged in user orders
// @route   GET /api/orders/myorders
// @access  Private
export const getMyOrdersAll = asyncHandler(async (req, res) => {
    const orders = await Order.find({ })
  
    let counter2 = 0; 
    for (let i = 0; i < orders.length; i++) {
       counter2++;
  }
        let allOrder
        const orders2 = await Order.find({ isPaid: true })
        const addDecimals = (num) => { 
            return (Math.round(num * 100) / 100).toFixed(2)
        }
        let real = addDecimals(
          allOrder = orders2.reduce((acc, item) => acc + item.totalPrice, 0)
        )
        function kFormatter(num) {
          return Math.abs(num) > 999 ? Math.sign(num)*((Math.abs(num)/1000).toFixed(1)) + 'k' : Math.sign(num)*Math.abs(num)
        }
  let real2 = kFormatter(real)
  counter2 = kFormatter(counter2)
    res.json({counter2, real, real2 })
})



// @desc    Get All orders
// @route   GET /api/orders
// @access  Private/admin
export const getOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({}).populate('user')
  orders.sort((a, b) => (a._id > b._id) ? -1 : 1);
    res.json(orders)
})