import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import logger from "morgan";
import { connectDb } from './config/db.js'
import authRoute from './routes/auth.route.js'
import messageRoute from './routes/message.route.js'
import cookieParser from 'cookie-parser'
import errorHandler from './middlewares/error.middleware.js';
import {app,server} from './config/socketio.js'
dotenv.config()
app.use(express.json({ limit: "10mb" })); 
app.use(express.urlencoded({ limit: "10mb", extended: true }));

// app.use(express.json())
// app.use(express.urlencoded({ extended: true }));
app.use(cors({
    credentials: true,
    origin: ['http://localhost:3000'],

}));

app.use(logger('dev'));
app.use(cookieParser());
app.use(authRoute)
app.use(messageRoute)
app.use(errorHandler);
server.listen(5001, () => {
    connectDb()
    console.log('servr running')
})
//