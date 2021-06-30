import mongoose from 'mongoose'

const connectDB = async () => {
    try {
        const conn = await mongoose.connect('mongodb+srv://kaahiye:kaahiye1234@cluster0.oaalo.mongodb.net/caawiye?retryWrites=true&w=majority', {
            useUnifiedTopology: true,
            useNewUrlParser: true,
            useCreateIndex: true,

        })

        console.log(`MongoDB Connected: ${conn.connection.host}`.cyan.underline)


    } catch (error) {
        console.error(`Error ${error.message}`.red.underline.bold)
        process.exit(1)
    }
}

export default connectDB