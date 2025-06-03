import React, { useState, useEffect } from "react";

interface Props {
    images: string[];
    columns?: number;
    height?: string;
    onDeleteImage?: (url: string) => Promise<void>; // callback za brisanje slike
    loading?: boolean; // ali prikazati loader
    imagesPerPage?: number; // koliko slik na stran, default 9
}

const ImageGrid: React.FC<Props> = ({
    images,
    columns = 3,
    height = "h-40",
    onDeleteImage,
    loading = false,
    imagesPerPage = 9,
}) => {
    const [selected, setSelected] = useState<string | null>(null);
    const [page, setPage] = useState(1);
    const [deletingUrl, setDeletingUrl] = useState<string | null>(null); // slika, ki se briše

    const totalPages = Math.ceil(images.length / imagesPerPage);

    // Pridobi slike za trenutno stran
    const pagedImages = images.slice((page - 1) * imagesPerPage, page * imagesPerPage);

    // Handler za brisanje slike z animacijo
    const handleDelete = (url: string) => {
        if (!onDeleteImage) return;

        setDeletingUrl(url); // označi sliko za izbris (za animacijo)
    };

    // Ko se deletingUrl nastavi, po animaciji izvedemo dejanski delete
    useEffect(() => {
        if (!deletingUrl) return;

        // Čas animacije (ustrezno CSS animaciji, npr. 300ms)
        const timeout = setTimeout(async () => {
            await onDeleteImage(deletingUrl);
            setDeletingUrl(null);
            // Če je zadnja slika na strani in stran ni prva, prestavi na prejšnjo stran
            if (pagedImages.length === 1 && page > 1) {
                setPage(page - 1);
            }
            setSelected(null);
        }, 350);

        return () => clearTimeout(timeout);
    }, [deletingUrl]);

    if (loading)
        return (
            <div className="flex justify-center items-center py-10">
                <div className="loader ease-linear rounded-full border-8 border-t-8 border-gray-200 h-16 w-16"></div>
                <style>{`
                    .loader {
                        border-top-color: #3498db;
                        animation: spin 1s linear infinite;
                    }
                    @keyframes spin {
                        0% { transform: rotate(0deg); }
                        100% { transform: rotate(360deg); }
                    }
                `}</style>
            </div>
        );

    if (images.length === 0)
        return <p className="text-gray-500 text-center mt-6">No images uploaded yet.</p>;

    const gridColsClass = `grid-cols-2 md:grid-cols-${columns}`;
    const imageHeightClass = height;

    return (
        <>
            <div
                className={`grid ${gridColsClass} gap-4`}
                style={{ animation: "fadeIn 0.5s ease forwards" }}
            >
                {pagedImages.map((url, i) => {
                    // Dodamo class za animacijo izbrisa, če se ta url briše
                    const isDeleting = url === deletingUrl;

                    return (
                        <div
                            key={url}
                            className={`relative group rounded-lg overflow-hidden
                                transition-opacity duration-300 ease-in-out
                                ${isDeleting ? "opacity-0 scale-95" : "opacity-100 scale-100"}`}
                            style={{ transitionProperty: "opacity, transform" }}
                        >
                            <img
                                src={url}
                                alt={`Uploaded ${i}`}
                                onClick={() => setSelected(url)}
                                className={`w-full ${imageHeightClass} object-cover cursor-pointer
                                    hover:opacity-90 hover:scale-105 hover:shadow-lg transition
                                    duration-300 ease-in-out
                                    `}
                                style={{ animation: `fadeInUp 0.3s ease forwards`, animationDelay: `${i * 100}ms` }}
                            />
                            {onDeleteImage && !isDeleting && (
                                <button
                                    onClick={() => handleDelete(url)}
                                    className="absolute top-2 right-2 bg-red-600 bg-opacity-80 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                                    title="Delete image"
                                    aria-label="Delete image"
                                >
                                    🗑
                                </button>
                            )}
                        </div>
                    );
                })}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex justify-center space-x-3 mt-6">
                    <button
                        disabled={page === 1}
                        onClick={() => setPage(page - 1)}
                        className={`px-3 py-1 rounded ${
                            page === 1
                                ? "bg-gray-400 cursor-not-allowed"
                                : "bg-blue-600 hover:bg-blue-700 text-white"
                        }`}
                    >
                        Prev
                    </button>
                    {[...Array(totalPages)].map((_, i) => (
                        <button
                            key={i}
                            onClick={() => setPage(i + 1)}
                            className={`px-3 py-1 rounded ${
                                page === i + 1
                                    ? "bg-blue-800 text-white"
                                    : "bg-blue-600 hover:bg-blue-700 text-white"
                            }`}
                        >
                            {i + 1}
                        </button>
                    ))}
                    <button
                        disabled={page === totalPages}
                        onClick={() => setPage(page + 1)}
                        className={`px-3 py-1 rounded ${
                            page === totalPages
                                ? "bg-gray-400 cursor-not-allowed"
                                : "bg-blue-600 hover:bg-blue-700 text-white"
                        }`}
                    >
                        Next
                    </button>
                </div>
            )}

            {/* Modal preview */}
            {selected && (
                <div
                    className="fixed inset-0 z-50 bg-black bg-opacity-90 flex items-center justify-center animate-fadeIn"
                    onClick={() => setSelected(null)}
                >
                    <img
                        src={selected}
                        alt="Preview"
                        className="max-w-[90%] max-h-[90%] rounded-lg shadow-2xl animate-scaleUp"
                        onClick={(e) => e.stopPropagation()}
                    />
                    <button
                        onClick={() => setSelected(null)}
                        className="absolute top-6 right-6 text-white text-4xl hover:text-gray-300 transition-colors duration-300"
                        aria-label="Close"
                    >
                        ✕
                    </button>
                </div>
            )}

            <style>{`
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                @keyframes fadeInUp {
                    from {
                        opacity: 0;
                        transform: translateY(10px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                @keyframes scaleUp {
                    from {
                        transform: scale(0.95);
                    }
                    to {
                        transform: scale(1);
                    }
                }
                .animate-fadeIn {
                    animation: fadeIn 0.3s ease forwards;
                }
                .animate-scaleUp {
                    animation: scaleUp 0.3s ease forwards;
                }
            `}</style>
        </>
    );
};

export default ImageGrid;
