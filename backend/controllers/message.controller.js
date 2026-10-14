import asyncHandler from 'express-async-handler'
import User from '../models/user.model.js'
import Message from '../models/message.model.js'
import cloudinary from '../config/cloudinary.js'
import { getReceiverSocketId, io } from '../config/socketio.js'

// GET /users — all users except self, with last message + unread count
export const getAllUsers = asyncHandler(async (req, res) => {
    const loggedUserId = req.user._id;

    const users = await User.find({ _id: { $ne: loggedUserId } })
        .select("-password")
        .lean();

    const usersWithMeta = await Promise.all(
        users.map(async (user) => {
            const lastMessage = await Message.findOne({
                $or: [
                    { senderId: loggedUserId, recieverId: user._id },
                    { senderId: user._id,     recieverId: loggedUserId },
                ],
            })
                .sort({ createdAt: -1 })
                .select("text image createdAt read senderId")
                .lean();

            const unreadCount = await Message.countDocuments({
                senderId:   user._id,
                recieverId: loggedUserId,
                read:       false,
            });

            return { ...user, lastMessage, unreadCount };
        })
    );

    res.status(200).json(usersWithMeta);
});

// GET /:id — conversation messages
export const getMessages = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const myId = req.user._id;

    const messages = await Message.find({
        $or: [
            { senderId: myId, recieverId: id },
            { senderId: id,   recieverId: myId },
        ],
    });

    res.status(200).json(messages);
});

// POST /send/:id — send a message
export const sendMessage = asyncHandler(async (req, res) => {
    const { text, image } = req.body;
    const senderId   = req.user._id;
    const recieverId = req.params.id;

    let imageUrl;
    if (image) {
        const uploadResponse = await cloudinary.uploader.upload(image);
        imageUrl = uploadResponse.secure_url;
    }

    const newMessage = await Message.create({ senderId, recieverId, text, image: imageUrl });

    const recieverSocketId = getReceiverSocketId(recieverId);
    if (recieverSocketId) io.to(recieverSocketId).emit("newMessage", newMessage);

    res.status(201).json(newMessage);
});

// PUT /read/:senderId — mark all unread messages from senderId as read
export const markAsRead = asyncHandler(async (req, res) => {
    const { senderId } = req.params;
    const readerId = req.user._id;

    await Message.updateMany(
        { senderId, recieverId: readerId, read: false },
        { $set: { read: true } }
    );

    // Tell the sender their messages have been read
    const senderSocketId = getReceiverSocketId(senderId);
    if (senderSocketId) {
        io.to(senderSocketId).emit("messagesRead", {
            senderId,
            readerId: readerId.toString(),
        });
    }

    res.status(200).json({ success: true });
});

// POST /react/:messageId — toggle a reaction on a message
export const reactToMessage = asyncHandler(async (req, res) => {
    const { messageId } = req.params;
    const { emoji }     = req.body;
    const userId        = req.user._id;

    const message = await Message.findById(messageId);
    if (!message) {
        res.status(404);
        throw new Error("Message not found");
    }

    const existingIdx = message.reactions.findIndex(
        (r) => r.userId.toString() === userId.toString() && r.emoji === emoji
    );

    if (existingIdx >= 0) {
        // Same emoji → remove (toggle off)
        message.reactions.splice(existingIdx, 1);
    } else {
        // Replace any existing reaction from this user, then add new one
        message.reactions = message.reactions.filter(
            (r) => r.userId.toString() !== userId.toString()
        );
        message.reactions.push({ emoji, userId });
    }

    await message.save();

    // Notify both parties
    const senderSocketId   = getReceiverSocketId(message.senderId.toString());
    const receiverSocketId = getReceiverSocketId(message.recieverId.toString());
    if (senderSocketId)   io.to(senderSocketId).emit("messageReacted", message);
    if (receiverSocketId) io.to(receiverSocketId).emit("messageReacted", message);

    res.status(200).json(message);
});
