import React from "react";
import UserInfoCard from "../../components/dashboard/UserInfoCard";

const UserPage: React.FC = () => {
    return (
        <div className="p-6 text-white">
            <h1 className="text-3xl font-bold mb-6">User Profile</h1>
            <UserInfoCard />
        </div>
    );
};

export default UserPage;
