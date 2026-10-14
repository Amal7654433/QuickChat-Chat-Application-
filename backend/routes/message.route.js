import express from 'express'
import { ProtectedRoute } from '../middlewares/auth.middleware.js'
import {
    getAllUsers,
    getMessages,
    sendMessage,
    markAsRead,
    reactToMessage,
} from '../controllers/message.controller.js'

const router = express.Router()

router.get('/users',              ProtectedRoute, getAllUsers)
router.get('/:id',                ProtectedRoute, getMessages)
router.post('/send/:id',          ProtectedRoute, sendMessage)
router.put('/read/:senderId',     ProtectedRoute, markAsRead)
router.post('/react/:messageId',  ProtectedRoute, reactToMessage)

export default router
