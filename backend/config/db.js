import mongoose from "mongoose"

export const connectDb = async () => {
    try {
        const con = await mongoose.connect(process.env.MONGO_URL)
        console.log('db conncted success')
    } catch (error) {
        console.log(error)
    }
}