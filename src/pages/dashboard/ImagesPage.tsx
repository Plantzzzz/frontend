import React from "react";
import PlantImageUploader from "../../components/dashboard/PlantImageUploader";

const ImagesPage: React.FC = () => {
    return (
        <div className="max-w-4xl mx-auto p-6">
            <h1 className="text-4xl font-bold mb-12 text-center animate-fade-in-up">
                🌱 Plant Images
            </h1>
            <PlantImageUploader />
        </div>
    );
};

export default ImagesPage;
