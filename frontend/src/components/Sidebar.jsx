import { useState, useEffect } from "react";
import { AlignRight, X, Search } from "lucide-react"; // Importing icons from Lucide
import { useChatStore } from "../store/useChatStore";
import { userAuthStore } from "../store/userAuth";

const Sidebar = ({ setddd }) => {

    const [isOpen, setIsOpen] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [showOnlineOnly, setShowOnlineOnly] = useState(false);
    const { getUsers, users, isUsersLoading, setSelectUser, selectedUser } = useChatStore()
    const { onlineUsers } = userAuthStore()
    useEffect(() => {
        getUsers();
    }, [getUsers]);
    // /absolute w-60 z-50 " : "relative w-30

    const filteredUsers = users
        .filter(user => user.name.toLowerCase().includes(searchTerm.toLowerCase()))
        .filter(user => !showOnlineOnly || onlineUsers.includes(user._id));

    return (
        <div className={`h-screen  flex flex-col bg-gray-700 shadow-lg p-4 transition-all duration-300 ease-in-out ${isOpen ? "w-70" : "w-30"}`}>



            <button onClick={() => {
                setIsOpen(!isOpen)
                setddd(isOpen)
            }} className="btn btn-circle btn-sm mb-4">
                {isOpen ? <X size={20} /> : <AlignRight size={20} />}
            </button>

            {isOpen && (
                <div className="mb-4 relative">
                    <input
                        type="text"
                        placeholder="Search users..."
                        className="input text-gray-800 input-bordered w-full pl-10 bg-slate-100"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <Search className="absolute left-3 top-3 text-gray-500" size={18} />
                </div>
            )}

            {isOpen && (
                <div className="cursor-pointer truncate text-gray-100 flex items-center gap-2 mb-4">
                    <span className="text-sm">Show online only</span>
                    <input
                        type="checkbox"
                        checked={showOnlineOnly}
                        onChange={(e) => setShowOnlineOnly(e.target.checked)}
                        className="checkbox checkbox-sm text-indigo-700 ring-1"
                    />
                    <span className="text-xs text-gray-100">({onlineUsers.length - 1} online)</span>
                </div>
            )}


            <div className="flex-1 overflow-y-auto  ">
                <ul className="">
                    {filteredUsers.map((user) => (
                        <li
                            onClick={() => setSelectUser(user)}
                            key={user._id}
                            className={`flex bg-gray-100 items-center gap-3 p-2 backdrop-brightness-150 rounded-xl transition-all duration-200 ease-in-out hover:shadow-md hover:bg-indigo-400 cursor-pointer ${selectedUser?._id === user._id ? "bg-gray-400 ring-1 ring-base-300 text-white" : ""
                                }mb-2`}
                        >
                            <img
                                src={user.profilePic || 'https://img.freepik.com/premium-vector/default-avatar-profile-icon-social-media-user-image-gray-avatar-icon-blank-profile-silhouette-vector-illustration_561158-3383.jpg?semt=ais_hybrid'}
                                alt={user.name}
                                className="w-10 h-10 rounded-full"
                            />
                            {isOpen && (
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center space-x-2">
                                        <h4 className="font-semibold truncate text-gray-800">{user.name}</h4>
                                        {onlineUsers.includes(user._id) && (
                                            <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                                        )}
                                    </div>
                                    <span className="py-1 text-xs text-gray-900">
                                        {onlineUsers.includes(user._id) ? "Online" : "Offline"}
                                    </span>
                                </div>
                            )}
                        </li>
                    ))}
                </ul>
                {filteredUsers.length === 0 && (
                    <div className="text-center text-zinc-500 py-4">No online users</div>
                )}
            </div>
        </div>
    );


};

export default Sidebar;
