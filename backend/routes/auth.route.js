import express from 'express'
const router=express.Router()
import { checkAuth, updatProfile, userLogin, userLogout, userSignup } from '../controllers/auth.controller.js'
import { ProtectedRoute } from '../middlewares/auth.middleware.js'

router.post('/signup',userSignup)
router.post('/login',userLogin)
router.post('/logout',userLogout)
router.put('/update',ProtectedRoute,updatProfile)
router.get('/check',ProtectedRoute,checkAuth)
export default router
