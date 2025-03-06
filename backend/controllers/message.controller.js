import asyncHandler from 'express-async-handler'
import User from '../models/user.model.js'
import Message from '../models/message.model.js'
import cloudinary from '../config/cloudinary'


export const getAllUsers = asyncHandler(async (req, res) => {
    const loggedUserId = req.user._id
    const filterdUsers = await User.find({ _id: { $ne: loggedUserId } }).select("-password")
    res.status(200).json(filterdUsers)
})

export const getMessages = asyncHandler(async (req, res) => {
    const { id } = req.params
    const myId = req.user._id
    const messages = await Message.find({ $or: [{ senderId: myId, recieverId: id }, { senderId: id, recieverId: myId }] })
    res.status(200).json(messages)
})
export const sendMessage = asyncHandler(async (req, res) => {
    const { text, image } = req.params
    const senderId = req.user._id
    const recieverId = req.params.id
    let imageUrl
    if (image) {
        const uploadResponse = await cloudinary.uploader.upload(image)
        imageUrl = uploadResponse.secure_url
    }
    const newMessage = new Message({
        senderId,
        recieverId,
        text,
        image: imageUrl
    })
    await newMessage.save()
    res.send(201).json(newMessage)

})