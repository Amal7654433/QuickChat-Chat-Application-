import React from 'react'
import { Link } from "react-router-dom";
import { LogOut, MessageSquare, Settings, User } from "lucide-react";
import { userAuthStore } from '../store/userAuth';
const Navbar = () => {
    const { logout, authUser } = userAuthStore()
    return (
        <nav className="flex justify-between items-center p-4 bg-blue-600 text-white">
        {/* Left Side - App Title */}
        <h1 className="text-xl font-bold">Chat App</h1>

        {/* Right Side - Profile, Settings, and Logout */}
        {authUser && (
            <div className="flex items-center gap-4">
                {/* Profile Link */}
                <Link to="/profile" className="btn btn-sm gap-2 bg-white text-blue-600 hover:bg-gray-200">
                    <User className="size-5" />
                    <span className="hidden sm:inline">Profile</span>
                </Link>

                {/* Settings Link */}
                <Link to="/settings" className="btn btn-sm gap-2 bg-white text-blue-600 hover:bg-gray-200">
                    <Settings className="size-5" />
                    <span className="hidden sm:inline">Settings</span>
                </Link>

                {/* Logout Button */}
                <button className="flex gap-2 items-center bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600" onClick={logout}>
                    <LogOut className="size-5" />
                    <span className="hidden sm:inline">Logout</span>
                </button>
            </div>
        )}
    </nav>
    )
}

export default Navbar