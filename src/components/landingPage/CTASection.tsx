import {Link} from "react-router-dom";

const baseURL = "/landingPage";

export const CTASection = () => (
    <>
        <section className="bg-green-600 text-white px-6 md:px-12 pt-14 pb-24">
            <div className="max-w-screen-xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
                <h3 className="text-2xl md:text-3xl font-semibold">
                    Ready to Grow with Us?
                </h3>
                <div className="flex gap-4">
                    <Link to={`${baseURL}/register`}>
                        <button className="bg-black text-white px-5 py-2 rounded-md hover:bg-gray-800 transition">
                            Get started
                        </button>
                    </Link>
                    <Link to={`${baseURL}/about`}>
                        <button className="bg-white text-green-700 px-5 py-2 rounded-md hover:bg-gray-100 transition">
                            Learn More
                        </button>
                    </Link>
                </div>
            </div>
        </section>
    </>
);
