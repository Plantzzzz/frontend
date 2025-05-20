// components/ImageGrid.tsx
import React, { useState } from "react";

interface Props {
    images: string[];
    columns?: number; // optional override
    height?: string;  // e.g. 'h-40' or 'h-24'
}

const ImageGrid: React.FC<Props> = ({ images, columns = 3, height = "h-40" }) => {
    const [selected, setSelected] = useState<string | null>(null);

    if (images.length === 0) return <p className="text-gray-500">No images uploaded yet.</p>;

    const gridColsClass = `grid-cols-2 md:grid-cols-${columns}`;
    const imageHeightClass = height;

    return (
        <>
            <div className={`grid ${gridColsClass} gap-4`}>
                {images.map((url, i) => (
                    <img
                        key={i}
                        src={url}
                        alt={`Uploaded ${i}`}
                        onClick={() => setSelected(url)}
                        className={`w-full ${imageHeightClass} object-cover rounded cursor-pointer hover:opacity-80 transition`}
                    />
                ))}
            </div>

            {selected && (
                <div
                    className="fixed inset-0 z-50 bg-black bg-opacity-80 flex items-center justify-center"
                    onClick={() => setSelected(null)}
                >
                    <img
                        src={selected}
                        alt="Preview"
                        className="max-w-[90%] max-h-[90%] rounded shadow-lg"
                        onClick={(e) => e.stopPropagation()}
                    />
                    <button
                        onClick={() => setSelected(null)}
                        className="absolute top-4 right-4 text-white text-3xl hover:text-gray-300"
                        aria-label="Close"
                    >
                        ✕
                    </button>
                </div>
            )}
        </>
    );
};

export default ImageGrid;
