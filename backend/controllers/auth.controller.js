import bcrypt from 'bcryptjs'
import User from '../models/user.model.js'
import { generateToken } from '../libs/util.js'
import cloudinary from '../config/cloudinary.js'
import asyncHandler from 'express-async-handler'

export const userSignup = asyncHandler(async (req, res) => {
    const { name, username, email, password } = req.body

    if (!username) return res.status(400).json({ message: "Username is required" })

    // Check for duplicate email or username
    const existingEmail    = await User.findOne({ email: email.toLowerCase() })
    if (existingEmail) return res.status(400).json({ message: "Email already exists" })

    const existingUsername = await User.findOne({ username: username.toLowerCase() })
    if (existingUsername) return res.status(400).json({ message: "Username already taken" })

    const salt           = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)

    const newUser = new User({ name, username: username.toLowerCase(), email, password: hashedPassword })
    await newUser.save()

    generateToken(newUser._id, res)
    res.status(201).json({ message: "User created successfully", newUser })
})

export const userLogin = asyncHandler(async (req, res) => {
    const { email, password } = req.body

    const user = await User.findOne({ email: email.toLowerCase() })
    if (!user || !(await bcrypt.compare(password, user.password))) {
        return res.status(401).json({ message: "Incorrect password or email" })
    }

    generateToken(user._id, res)
    res.status(200).json({ message: "User logged in successfully", user })
})

export const userLogout = asyncHandler(async (req, res) => {
    res.cookie('jwt', '', { maxAge: 0 })
    return res.status(200).json({ message: "User logged out successfully" })
})

export const updatProfile = asyncHandler(async (req, res) => {
    const { profilePic } = req.body
    const userId = req.user._id
    if (!profilePic) return res.status(400).json({ message: 'No picture found' })

    const uploadResponse = await cloudinary.uploader.upload(profilePic)
    const updatedUser = await User.findByIdAndUpdate(
        userId,
        { profilePic: uploadResponse.secure_url },
        { new: true }
    )
    res.status(200).json(updatedUser)
})

export const checkAuth = asyncHandler(async (req, res) => {
    res.status(200).json(req.user)
})

// GET /check-username/:username — real-time availability check
export const checkUsername = asyncHandler(async (req, res) => {
    const { username } = req.params
    const exists = await User.findOne({ username: username.toLowerCase() })
    res.status(200).json({ available: !exists })
})
