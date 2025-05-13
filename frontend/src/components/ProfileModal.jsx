import { useState, useEffect } from "react";
import { X, UserPlus, Users } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";
import { useChatStore } from "../store/useChatStore";

const ProfileModal = ({ type = "user", user, group, open, onClose }) => {
    const [showCreateGroup, setShowCreateGroup] = useState(false);
    const [groupName, setGroupName] = useState("");
    const [isCreating, setIsCreating] = useState(false);
    const [selectedFriends, setSelectedFriends] = useState([]);
    const { authUser } = useAuthStore();
    const { createGroup, friends } = useChatStore();

    useEffect(() => {
        // If opening for creating a new group directly, set showCreateGroup to true
        if (open && type === "group" && !group) {
            setShowCreateGroup(true);
            // If opening with a user, pre-select that user for the group
            if (user && user._id) {
                setSelectedFriends([user._id]);
            }
        }
    }, [open, type, group, user]);

    // Handle close via click outside
    const handleBackdropClick = (e) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    if (!open) return null;
    
    // Updated condition to work with direct group creation
    if (type === "user" && !user) return null;
    if (type === "group" && !group && !showCreateGroup) return null;

    const handleToggleFriend = (friendId) => {
        if (selectedFriends.includes(friendId)) {
            setSelectedFriends(selectedFriends.filter(id => id !== friendId));
        } else {
            setSelectedFriends([...selectedFriends, friendId]);
        }
    };

    const handleCreateGroup = async () => {
        if (!groupName.trim() || selectedFriends.length === 0) return;
        
        setIsCreating(true);
        try {
            await createGroup({
                name: groupName,
                members: [...selectedFriends, authUser._id]
            });
            setGroupName("");
            setSelectedFriends([]);
            setShowCreateGroup(false);
            onClose();
        } catch (error) {
            console.error("Failed to create group:", error);
        } finally {
            setIsCreating(false);
        }
    };

    // If we're creating a new group (not showing details of existing)
    const isNewGroup = type === "group" && !group;

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={handleBackdropClick}>
            <div className="bg-base-100 rounded-2xl shadow-lg w-full max-w-md overflow-hidden animate-popIn" onClick={e => e.stopPropagation()}>
                <div className="p-4 border-b border-base-300 flex justify-between items-center">
                    <h3 className="text-lg font-semibold">
                        {isNewGroup || showCreateGroup ? "Create New Group" : 
                         type === "user" ? user?.fullName : group?.name}
                    </h3>
                    <button
                        onClick={onClose}
                        className="btn btn-circle btn-ghost btn-sm"
                    >
                        <X size={18} />
                    </button>
                </div>
                
                <div className="p-6">
                    {/* Profile Information for existing user/group */}
                    {!showCreateGroup && !isNewGroup && (
                        <div className="flex items-center flex-col gap-4 mb-6">
                            <div className="avatar">
                                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary to-secondary text-white flex items-center justify-center text-3xl font-semibold">
                                    {type === "user" && (
                                        user.profilePicture || user.profilePic ? (
                                            <img
                                                src={user.profilePicture || user.profilePic}
                                                alt={user.fullName}
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <img src="/avatar.png" alt={user.fullName} className="w-full h-full object-cover" />
                                        )
                                    )}
                                    {type === "group" && (
                                        group.avatar ? (
                                            <img
                                                src={group.avatar}
                                                alt={group.name}
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            group.name?.charAt(0)
                                        )
                                    )}
                                </div>
                            </div>

                            {/* Display User/Group info */}
                            {type === "user" && (
                                <div className="text-center">
                                    <h2 className="text-xl font-bold mb-1">{user.fullName}</h2>
                                    <p className="text-quaternary-content/80 text-sm">{user.email}</p>
                                </div>
                            )}
                            
                            {type === "group" && (
                                <div className="text-center">
                                    <h2 className="text-xl font-bold mb-1">{group.name}</h2>
                                    <p className="text-quaternary-content/80 text-sm">
                                        {group.members?.length || 0} members
                                    </p>
                                    {group.description && (
                                        <p className="mt-2 text-base-content">{group.description}</p>
                                    )}
                                </div>
                            )}
                        </div>
                    )}

                    {/* Group Members List */}
                    {type === "group" && !showCreateGroup && !isNewGroup && (
                        <div className="mt-4">
                            <h3 className="font-medium mb-2 text-quaternary-content/90 flex items-center gap-2">
                                <Users size={16} /> Members
                            </h3>
                            <div className="max-h-48 overflow-y-auto custom-scrollbar space-y-2">
                                {group.members?.map(member => (
                                    <div key={member._id} className="flex items-center gap-2 p-2 rounded-lg">
                                        <div className="avatar">
                                            <div className="w-8 h-8 rounded-full bg-base-300 flex items-center justify-center">
                                                {member.profilePicture ? (
                                                    <img
                                                        src={member.profilePicture}
                                                        alt={member.fullName}
                                                        className="w-full h-full object-cover"
                                                    />
                                                ) : (
                                                    member.fullName?.charAt(0)
                                                )}
                                            </div>
                                        </div>
                                        <span>{member.fullName}</span>
                                        {group.admin && member._id === group.admin._id && (
                                            <span className="text-xs bg-primary/20 text-primary px-2 py-0.5 rounded-full">
                                                Admin
                                            </span>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Create New Group Form */}
                    {(showCreateGroup || isNewGroup) && (
                        <div className="animate-popIn space-y-4">
                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text">Group Name</span>
                                </label>
                                <input
                                    type="text"
                                    className="input input-bordered w-full"
                                    placeholder="Enter group name"
                                    value={groupName}
                                    onChange={(e) => setGroupName(e.target.value)}
                                />
                            </div>
                            
                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text">Select Friends</span>
                                </label>
                                <div className="max-h-48 overflow-y-auto custom-scrollbar space-y-2">
                                    {friends.length > 0 ? (
                                        friends.map(friendship => {
                                            // Get the friend object
                                            const friend = friendship.requester._id === authUser._id ? 
                                                friendship.recipient : friendship.requester;
                                                
                                            return (
                                                <div
                                                    key={friend._id}
                                                    className={`flex items-center gap-2 p-2 rounded-lg cursor-pointer hover:bg-base-200 transition-all ${
                                                        selectedFriends.includes(friend._id) ? "bg-primary/10" : ""
                                                    }`}
                                                    onClick={() => handleToggleFriend(friend._id)}
                                                >
                                                    <input
                                                        type="checkbox"
                                                        className="checkbox checkbox-sm checkbox-primary"
                                                        checked={selectedFriends.includes(friend._id)}
                                                        onChange={() => {}}
                                                    />
                                                    <div className="avatar">
                                                        <div className="w-8 h-8 rounded-full bg-base-300 flex items-center justify-center">
                                                            {friend.profilePicture ? (
                                                                <img
                                                                    src={friend.profilePicture}
                                                                    alt={friend.fullName}
                                                                    className="w-full h-full object-cover"
                                                                />
                                                            ) : (
                                                                friend.fullName?.charAt(0)
                                                            )}
                                                        </div>
                                                    </div>
                                                    <span>{friend.fullName}</span>
                                                </div>
                                            );
                                        })
                                    ) : (
                                        <div className="text-center py-4 text-quaternary-content/60">
                                            Add some friends first to create a group
                                        </div>
                                    )}
                                </div>
                            </div>
                            
                            <div className="flex justify-end gap-2 mt-4">
                                <button 
                                    className="btn btn-ghost" 
                                    onClick={() => { 
                                        if (type === "user") {
                                            setShowCreateGroup(false);
                                        } else {
                                            onClose();
                                        }
                                    }}
                                    disabled={isCreating}
                                >
                                    Cancel
                                </button>
                                <button 
                                    className="btn btn-primary" 
                                    onClick={handleCreateGroup}
                                    disabled={!groupName.trim() || selectedFriends.length === 0 || isCreating}
                                >
                                    {isCreating ? "Creating..." : "Create Group"}
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Action Buttons */}
                    {type === "user" && !showCreateGroup && user && user._id !== authUser._id && (
                        <div className="flex gap-2 justify-center mt-2">
                            <button 
                                className="btn btn-secondary text-primary border-primary" 
                                onClick={() => setShowCreateGroup(true)}
                            >
                                <UserPlus size={18} /> Create Group with {user.fullName}
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProfileModal;