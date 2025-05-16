export const ContactFormSection = () => (
    <section className="py-20 px-6 md:px-12 bg-white text-black">
        <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8 text-center">
                Send Us a Message
            </h2>
            <form className="space-y-6">
                <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">Your Name</label>
                    <input
                        type="text"
                        id="name"
                        className="mt-1 block w-full border border-gray-300 rounded-md p-3 shadow-sm focus:ring-green-500 focus:border-green-500"
                        placeholder="John Doe"
                    />
                </div>
                <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">Your Email</label>
                    <input
                        type="email"
                        id="email"
                        className="mt-1 block w-full border border-gray-300 rounded-md p-3 shadow-sm focus:ring-green-500 focus:border-green-500"
                        placeholder="you@example.com"
                    />
                </div>
                <div>
                    <label htmlFor="message" className="block text-sm font-medium text-gray-700">Message</label>
                    <textarea
                        id="message"
                        rows={5}
                        className="mt-1 block w-full border border-gray-300 rounded-md p-3 shadow-sm focus:ring-green-500 focus:border-green-500"
                        placeholder="Type your message here..."
                    ></textarea>
                </div>
                <div className="text-center">
                    <button type="submit" className="bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700 transition">
                        Send Message
                    </button>
                </div>
            </form>
        </div>
    </section>
);
