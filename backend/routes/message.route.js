import express from 'express'
import { ProtectedRoute } from '../middlewares/auth.middleware.js'
import { getAllUsers } from '../controllers/message.controller.js'
const router=express.Router()
router.get('/users',ProtectedRoute,getAllUsers)
router.get('/:id',ProtectedRoute,getAllUsers)
export default router