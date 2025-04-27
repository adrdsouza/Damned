
import { Metadata } from "next"
import Link from 'next/link';
export const metadata: Metadata = {
  title: "Contact Us | Damned Designs",
  description:
    "Get in touch with Damned Designs. Whether you have questions about your order, products, or custom requests, we’re here to help.",
  alternates: {
    canonical: "https://damneddesigns.com/contact",
  },
  openGraph: {
    title: "Contact Us | Damned Designs",
    description:
      "Reach out to Damned Designs for inquiries, support, and custom gear. We're always happy to assist.",
    url: "https://damneddesigns.com/contact",
    siteName: "Damned Designs",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Contact Us | Damned Designs",
    description:
      "Have a question or need help? Contact the Damned Designs team today.",
  },
};


export default function ContactPage() {
  return (
    <main className="flex-grow px-[10px] md:px-[40px]">
      <div className="container py-12">
        {/* Breadcrumb */}
        

        {/* Content */}
        <div className="max-w-4xl mx-auto">
        <div className="flex items-center text-sm mb-6">
          <Link href="/" className="hover:underline">Home</Link>
          <svg
            width="16"
            height="16"
            stroke="currentColor"
            strokeWidth="2"
            className="lucide-icon lucide lucide-chevron-right mx-2"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="m9 18 6-6-6-6" />
          </svg>
          <span>Contact Us</span>
        </div>
          <h1 className="text-4xl font-bold mb-8">Contact Us</h1>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {/* Left Side - Contact Info */}
            <div>
              <p className="mb-6">
                We'd love to hear from you! Whether you have questions about our products,
                need assistance with an order, or want to discuss a custom design, our team
                is here to help.
              </p>

              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-bold mb-2">Email</h3>
                  <p>info@damneddesigns.com</p>
                </div>
                <div>
                  <h3 className="text-lg font-bold mb-2">Phone</h3>
                  <p>+1 3376029228</p>
                </div>
                <div>
                  <h3 className="text-lg font-bold mb-2">Hours</h3>
                  <p>Monday - Friday: 9am - 5pm EST</p>
                  <p>Saturday: 10am - 3pm EST</p>
                  <p>Sunday: Closed</p>
                </div>
                <div>
                  <h3 className="text-lg font-bold mb-2">Social Media</h3>
                  <div className="flex space-x-4">
                    <Link target="blank" href="https://instagram.com/damneddesigns" className="text-primary hover:text-gray-700">
                      Instagram
                    </Link>
                    <Link target="blank" href="https://facebook.com/damneddesigns" className="text-primary hover:text-gray-700">
                      Facebook
                    </Link>
                    <Link target="blank" href="https://twitter.com/damneddesigns" className="text-primary hover:text-gray-700">
                      Twitter
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Side - Contact Form */}
            <div>
              <h2 className="text-2xl font-bold mb-6">Send us a message</h2>
              <form method="POST">
                <div className="mb-4">
                  <label htmlFor="name" className="block mb-2 font-bold">Name</label>
                  <input
                    type="text"
                    id="name"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div className="mb-4">
                  <label htmlFor="email" className="block mb-2 font-bold">Email</label>
                  <input
                    type="email"
                    id="email"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div className="mb-4">
                  <label htmlFor="subject" className="block mb-2 font-bold">Subject</label>
                  <input
                    type="text"
                    id="subject"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div className="mb-6">
                  <label htmlFor="message" className="block mb-2 font-bold">Message</label>
                  <textarea
                    id="message"
                    rows={5}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  ></textarea>
                </div>
                <button type="submit" className="text-white bg-black hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-[5px] text-sm px-[40px] py-[18px]  dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700 text-center w-full">
                  Send Message
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
