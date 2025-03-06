import express from 'express'
const router=express.Router()
import { updatProfile, userLogin, userLogout, userSignup } from '../controllers/auth.controller.js'
import { ProtectedRoute } from '../middlewares/auth.middleware.js'

router.post('/signup',userSignup)
router.post('/login',userLogin)
router.post('/logout',userLogout)
router.put('/update',ProtectedRoute,updatProfile)
export default router
