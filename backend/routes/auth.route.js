import express from 'express'
import { checkAuth, checkUsername, updatProfile, userLogin, userLogout, userSignup } from '../controllers/auth.controller.js'
import { ProtectedRoute } from '../middlewares/auth.middleware.js'

const router = express.Router()

router.post('/signup',                    userSignup)
router.post('/login',                     userLogin)
router.post('/logout',                    userLogout)
router.put('/update',   ProtectedRoute,   updatProfile)
router.get('/check',    ProtectedRoute,   checkAuth)
router.get('/check-username/:username',   checkUsername)   // public — no auth needed

export default router
