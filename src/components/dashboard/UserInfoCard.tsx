import React from "react";
import ProfileImageUploader from "./ProfileImageUploader"; // Adjust path if needed

const UserInfoCard: React.FC = () => {
    const user = JSON.parse(sessionStorage.getItem("user") || "{}");

    return (
        <div className="bg-white dark:bg-gray-900 text-gray-800 dark:text-white shadow-xl rounded-2xl p-6 w-full max-w-lg mx-auto transition-all duration-300">
            <div className="flex items-center gap-5 mb-6">
                {user.profileImage ? (
                    <img
                        src={user.profileImage}
                        alt="User profile"
                        className="w-20 h-20 rounded-full object-cover ring-2 ring-offset-2 ring-gray-300 dark:ring-gray-700"
                    />
                ) : (
                    <div className="w-20 h-20 rounded-full bg-gray-600 flex items-center justify-center text-white text-sm font-semibold">
                        No Image
                    </div>
                )}
                <div className="flex flex-col">
                    <h2 className="text-xl font-bold tracking-tight">
                        {user.username || "Unnamed User"}
                    </h2>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                        {user.email || "No email provided"}
                    </span>
                </div>
            </div>

            <div className="border-t border-gray-200 dark:border-gray-700 pt-4 space-y-3 text-sm">
                <div className="flex justify-between">
                    <span className="font-medium text-gray-600 dark:text-gray-300">UID</span>
                    <span className="text-gray-700 dark:text-gray-200">
                        {user.uid || "Not available"}
                    </span>
                </div>
            </div>

            <ProfileImageUploader />
        </div>
    );
};

export default UserInfoCard;
