import { X } from "lucide-react";
import { useChatStore } from "../store/useChatStore";
import { userAuthStore } from "../store/userAuth";


const ChatHeader = () => {
    const { selectedUser, setSelectUser } = useChatStore()
    const { onlineUsers } = userAuthStore()

    return (
        <div className="p-2.5 bg-gray-700 border-b border-base-300 ">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    {/* Avatar */}
                    <div className="avatar">
                        <div className="size-10 rounded-full relative">
                            <img src={selectedUser.profilePic || "/avatar.png"} alt={selectedUser.name} />
                        </div>
                    </div>

                    {/* User info */}
                    <div>
                        <div className="flex items-center space-x-2 ">
                            <h3 className="font-medium text-gray-100">{selectedUser.name}

                            </h3>
                            {onlineUsers.includes(selectedUser._id) && (
                                <span className="w-2 h-2 bg-green-400 rounded-full"></span>
                            )}
                        </div>

                        <p className="text-sm text-base-content/70">
                            {onlineUsers.includes(selectedUser._id) ? "Online" : "Offline"}
                        </p>
                    </div>
                </div>

                {/* Close button */}
                <button className="w-6 h-6 flex items-center justify-center rounded-full text-xs p-1" onClick={() => setSelectUser(null)}>
                    <X />
                </button>
            </div>
        </div>
    );
};
export default ChatHeader;