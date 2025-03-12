import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import logger from "morgan";
import { connectDb } from './config/db.js'
import authRoute from './routes/auth.route.js'
import messageRoute from './routes/message.route.js'
import cookieParser from 'cookie-parser'
import errorHandler from './middlewares/error.middleware.js';
import { app, server } from './config/socketio.js'

import path from "path";
const __dirname = path.resolve();
dotenv.config()
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));
const PORT = process.env.PORT
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
if (process.env.NODE_ENV === "production") {
    app.use(express.static(path.join(__dirname, "../frontend/dist")));

    app.get("*", (req, res) => {
        res.sendFile(path.join(__dirname, "../frontend", "dist", "index.html"));
    });
}
server.listen(PORT, () => {
    connectDb()
    console.log('servr running')
})
//