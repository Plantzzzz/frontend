import React from "react";
import ProfileImageUploader from "./ProfileImageUploader";

const UserInfoCard: React.FC = () => {
    const user = JSON.parse(sessionStorage.getItem("user") || "{}");
    const profileImage = user.profileImage || user.photoURL || "/icon.svg";

    return (
        <div className="bg-gray-900 border border-gray-700 text-white rounded-2xl shadow-lg p-6 w-full max-w-lg mx-auto animate-fade-in transition-all duration-300">
            <div className="flex items-center gap-4 mb-6">
                <div className="relative">
                    <img
                        src={profileImage}
                        alt="User profile"
                        className="w-20 h-20 rounded-full object-cover ring-2 ring-green-500 transition-transform duration-300 hover:scale-105"
                        onError={(e) => {
                            e.currentTarget.src = "/icon.svg";
                        }}
                    />
                </div>
                <div className="flex flex-col">
                    <h2 className="text-2xl font-bold text-green-400">
                        {user.displayName || "Unnamed User"}
                    </h2>
                    <span className="text-sm text-gray-400">
                        {user.email || "No email provided"}
                    </span>
                </div>
            </div>

            <div className="border-t border-gray-700 pt-4 space-y-3 text-sm">
                <div className="flex justify-between">
                    <span className="font-semibold text-gray-400">UID</span>
                    <span className="text-gray-300">
                        {user.uid || "Not available"}
                    </span>
                </div>
            </div>

            <div className="mt-6">
                <ProfileImageUploader />
            </div>
        </div>
    );
};

export default UserInfoCard;
