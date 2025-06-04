import React from "react";
import PlantImageUploader from "../../components/dashboard/PlantImageUploader";

const ImagesPage: React.FC = () => {
    return (
        <div className="max-w-4xl mx-auto p-6">
            <PlantImageUploader />
        </div>
    );
};

export default ImagesPage;
