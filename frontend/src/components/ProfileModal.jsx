import React from "react";

const ProfileModal = ({ type = "user", user, group, open, onClose }) => {
    if (type === "user" && !user) return null;
    if (type === "group" && !group) return null;

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