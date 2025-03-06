import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import logger from "morgan";
import { connectDb } from './config/db.js'
import authRoute from './routes/auth.route.js'
import cookieParser from 'cookie-parser'
import errorHandler from './middlewares/error.middleware.js';
const app = express()
dotenv.config()
app.use(express.json())
app.use(express.urlencoded({ extended: true }));
app.use(logger('dev'));
app.use(cookieParser());
app.use(authRoute)
app.use(errorHandler);
app.listen(5000, () => {
    connectDb()
    console.log('servr running')
})
//