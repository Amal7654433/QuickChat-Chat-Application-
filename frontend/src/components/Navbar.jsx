import React from 'react'
import { Link } from "react-router-dom";
import { Home,LogOut, MessageSquare, Settings, User } from "lucide-react";
import { userAuthStore } from '../store/userAuth';
const Navbar = () => {
    const { logout, authUser } = userAuthStore()
    return (
        <nav className="flex justify-between items-center p-4 bg-indigo-600 text-white">
        {/* Left Side - App Title */}
        <div className='flex items-center gap-2'> {/* Added items-center and gap-2 */}
  <h1 className="text-xl font-bold">QuickChat</h1>
  <MessageSquare />
</div>
      
        {/* Right Side - Profile, Settings, and Logout */}
        {authUser && (
            <div className="flex items-center gap-4">
                 <Link to="/" className="flex gap-2 items-center text-white px-3 py-1 rounded hover:bg-gray-900">
                    <Home className="size-5" />
                    <span className="hidden sm:inline">Home</span>
                </Link>
                {/* Profile Link */}
                <Link to="/profile" className="flex gap-2 items-center text-white px-3 py-1 rounded hover:bg-gray-900">
                    <User className="size-5" />
                    <span className="hidden sm:inline">Profile</span>
                </Link>

                {/* Settings Link */}
                <Link to="/settings" className="flex gap-2 items-center text-white px-3 py-1 rounded hover:bg-gray-900">
                    <Settings className="size-5" />
                    <span className="hidden sm:inline">Settings</span>
                </Link>

                {/* Logout Button */}
                <button className="flex gap-2 items-center text-white px-3 py-1 rounded hover:bg-gray-900" onClick={logout}>
                    <LogOut className="size-5" />
                    <span className="hidden sm:inline">Logout</span>
                </button>
            </div>
        )}
    </nav>
    )
}

export default Navbar