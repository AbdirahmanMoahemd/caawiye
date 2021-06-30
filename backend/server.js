import path from 'path'
import express from 'express'
import dotenv from 'dotenv'
import colors from 'colors'
import morgan from 'morgan'
import { notFound, errorHandler } from './middleware/errorMidlleware.js'
import connectDB from './config/db2.js'
import productRoutes from './routes/productRoutes.js'
import userRoutes from './routes/userRoutes.js'
import orderRoutes from './routes/orderRoutes.js'
import slidesRoutes from './routes/slidesRoutes.js'
import testimonialRoutes from './routes/testimonialRoutes.js'
import promotionRoutes from './routes/promotionRoutes.js'
import uploadRoutes from './routes/uploadRoutes.js'
import products  from './data/products.js' 

dotenv.config()
connectDB()  
const app = express()
const NODE_ENV = 'development'
const PAYPAL_CLIENT_ID = 'ATe2evqLhzMwvul-WeBEi3kKXeVFeVXIUBtorMlmeWnmIPH8elu1q-Kd2YTgDrDPBy_Fjwvm_PMTY9ah'
if (NODE_ENV === 'development') {
    app.use(morgan('dev'))
}

app.use(express.json()) 



 
app.use('/api/products', productRoutes)
app.use('/api/users', userRoutes)
app.use('/api/orders', orderRoutes)
app.use('/api/slides', slidesRoutes)
app.use('/api/testimonials', testimonialRoutes)
app.use('/api/promotions', promotionRoutes) 
app.use('/api/upload', uploadRoutes)

app.get('/api/config/paypal', (req, res) =>
    res.send(PAYPAL_CLIENT_ID)
)



const __dirname = path.resolve()
app.use('/uploads', express.static(path.join(__dirname, '/uploads')))

if (NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '/frontend/build')))
    app.get('*', (req, res) => 
        res.sendFile(path.resolve(__dirname, 'frontend', 'build', 'index.html'))
      )
}
else {
    app.get('/',(req, res) => {
    res.send("API is runnin...")
})
} 


app.use(notFound)
app.use(errorHandler)

const PORT =  5000

app.listen(PORT, console.log(`Server running in ${NODE_ENV} mode on port ${PORT}`.yellow.bold))

