import React from "react";

const UserInfoCard: React.FC = () => {
    const user = JSON.parse(sessionStorage.getItem("user") || "{}");

    return (
        <div className="bg-gray-800 p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Account Information</h2>
            <div className="space-y-2 text-sm">
                <p><span className="font-medium">Email:</span> {user.email || "N/A"}</p>
                <p><span className="font-medium">UID:</span> {user.uid || "N/A"}</p>
                <p><span className="font-medium">Verified:</span> {user.emailVerified ? "Yes" : "No"}</p>
                <p><span className="font-medium">Display Name:</span> {user.displayName || "N/A"}</p>
            </div>
            {user.photoURL && (
                <img
                    src={user.photoURL}
                    alt="Profile"
                    className="mt-4 rounded-full w-24 h-24 object-cover border-2 border-gray-600"
                />
            )}
        </div>
    );
};

export default UserInfoCard;
