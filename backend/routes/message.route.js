import express from 'express'
import { ProtectedRoute } from '../middlewares/auth.middleware.js'
import { getAllUsers, getMessages, sendMessage } from '../controllers/message.controller.js'
const router=express.Router()
router.get('/users',ProtectedRoute,getAllUsers)
router.get('/:id',ProtectedRoute,getMessages)
router.post('/message',ProtectedRoute,sendMessage)
export default router