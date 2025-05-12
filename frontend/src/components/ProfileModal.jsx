import React, { useState } from "react";
import { useChatStore } from "../store/useChatStore";
import { useAuthStore } from "../store/useAuthStore";
import toast from "react-hot-toast";

const ProfileModal = ({ type = "user", user, group, open, onClose }) => {
    const [showCreateGroup, setShowCreateGroup] = useState(false);
    const [groupName, setGroupName] = useState("");
    const [isCreating, setIsCreating] = useState(false);
    const [selectedFriends, setSelectedFriends] = useState([]);
    const { authUser } = useAuthStore();
    const { createGroup, friends } = useChatStore();

    if (type === "user" && !user) return null;
    if (type === "group" && !group) return null;

    const handleToggleFriend = (friendId) => {
        setSelectedFriends((prev) =>
            prev.includes(friendId)
                ? prev.filter((id) => id !== friendId)
                : [...prev, friendId]
        );
    };

    const handleCreateGroup = async () => {
        if (!groupName.trim()) return;
        setIsCreating(true);
        try {
            // Always include yourself and the user
            const members = [
                authUser._id,
                user._id,
                ...selectedFriends.filter(
                    (id) => id !== authUser._id && id !== user._id
                ),
            ];
            await createGroup({
                name: groupName,
                members,
            });
            setShowCreateGroup(false);
            setGroupName("");
            setSelectedFriends([]);
            onClose();
        } catch (e) {
            toast.error("Failed to create group");
        } finally {
            setIsCreating(false);
        }
    };

    return (
        <>
            <input type="checkbox" id="profile-modal" className="modal-toggle" checked={!!open} readOnly />
            <div className="modal" role="dialog">
                <div className="modal-box">
                    {type === "user" && (
                        <>
                            <h3 className="font-bold text-lg">{user.fullName}</h3>
                            <img
                                src={user.profilePic || "/avatar.png"}
                                alt={user.fullName}
                                className="w-24 h-24 rounded-full mx-auto my-4"
                            />
                            {/* Add more user info here */}
                            <div className="mt-4">
                                {!showCreateGroup ? (
                                    <button
                                        className="btn btn-primary w-full"
                                        onClick={() => setShowCreateGroup(true)}
                                    >
                                        Create Group with {user.fullName}
                                    </button>
                                ) : (
                                    <div className="space-y-2">
                                        <input
                                            type="text"
                                            className="input input-bordered w-full"
                                            placeholder="Group name"
                                            value={groupName}
                                            onChange={(e) => setGroupName(e.target.value)}
                                            disabled={isCreating}
                                        />
                                        <div className="max-h-40 overflow-y-auto border rounded-lg p-2 mb-2">
                                            <p className="font-semibold mb-1 text-sm">Add friends:</p>
                                            {friends
                                                .filter(f => f._id !== user._id && f._id !== authUser._id)
                                                .map(friend => (
                                                    <label key={friend._id} className="flex items-center gap-2 cursor-pointer py-1 px-2 rounded hover:bg-base-200/40">
                                                        <input
                                                            type="checkbox"
                                                            checked={selectedFriends.includes(friend._id)}
                                                            onChange={() => handleToggleFriend(friend._id)}
                                                            disabled={isCreating}
                                                        />
                                                        <img
                                                            src={friend.profilePic || friend.avatar || "/avatar.png"}
                                                            alt={friend.fullName || friend.name || "Friend"}
                                                            className="w-6 h-6 rounded-full"
                                                        />
                                                        <span className="text-sm">{friend.fullName || friend.name || "Unknown"}</span>
                                                    </label>
                                                ))}
                                        </div>
                                        <button
                                            className="btn btn-success w-full"
                                            onClick={handleCreateGroup}
                                            disabled={isCreating || !groupName.trim()}
                                        >
                                            {isCreating ? "Creating..." : "Create Group"}
                                        </button>
                                        <button
                                            className="btn btn-ghost w-full"
                                            onClick={() => setShowCreateGroup(false)}
                                            disabled={isCreating}
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                )}
                            </div>
                        </>
                    )}
                    {type === "group" && (
                        <>
                            <h3 className="font-bold text-lg">{group.name}</h3>
                            <img
                                src={group.avatar || "/group.png"}
                                alt={group.name}
                                className="w-24 h-24 rounded-full mx-auto my-4"
                            />
                            <p className="text-base text-center mb-2">
                                Members: {group.members?.length || 0}
                            </p>
                            {/* Add more group info here */}
                        </>
                    )}
                    <div className="modal-action">
                        <button className="btn" onClick={onClose}>
                            Close
                        </button>
                    </div>
                </div>
                <label className="modal-backdrop" onClick={onClose}></label>
            </div>
        </>
    );
};

export default ProfileModal;