
import { Metadata } from "next"
import Image from 'next/image';
import Link from 'next/link';
import aboutimage from '../../../../assets/homepageknif1.jpg';
import { getBaseURL } from "@lib/util/env";


export const metadata: Metadata = {
    title: "About Us | Damned Designs",
    description:"Learn about Damned Designs, our mission, values, and the story behind our premium knives and EDC gear.",
    keywords: [
      "Damned Designs",
      "About Damned Designs",
      "EDC tools",
      "premium knives",
      "Adrian D'Souza",
      "knife craftsmanship",
      "custom knives",
      "EDC gear",
      "knife design",
    ],
    authors: [{ name: "Adrian D'Souza" }],
    creator: "Damned Designs",
    publisher: "Damned Designs",
    openGraph: {
      title: "About Us | Damned Designs - Premium Knives & EDC Tools",
      description:"Learn about Damned Designs, our mission, values, and the story behind our premium knives and EDC gear.",
      url: `${new URL(getBaseURL())}/about`,
      siteName: "Damned Designs",
      images: [
        {
          url: `${new URL(getBaseURL())}/assets/Damned-designs.jpeg`,
          width: 1200,
          height: 630,
          alt: "Inside Damned Designs Workshop",
        },
      ],
      locale: "en_US",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: "About Damned Designs - Premium EDC Tools",
      description:"Learn about Damned Designs, our mission, values, and the story behind our premium knives and EDC gear.",
      images: [`${new URL(getBaseURL())}/assets/Damned-designs.jpeg`],
      creator: "@damneddesigns", 
    },
    metadataBase: new URL(getBaseURL()),
    alternates: {
      canonical: "/about",
    },
  };

export default async  function AboutPage() {
  return (
    <main className="flex-grow px-[10px] md:px-[40px]">
      <div className="container py-12">
    

        <div className="max-w-4xl mx-auto">
                {/* Breadcrumb */}
        <div className="flex items-center text-sm mb-6">
          <Link href="/" className="hover:underline">Home</Link>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="lucide-icon lucide lucide-chevron-right mx-2"
          >
            <path d="m9 18 6-6-6-6" />
          </svg>
          <span>About Us</span>
        </div>
          <h1 className="text-4xl font-bold mb-8">About Damned Designs</h1>

          {/* Hero Image */}
          <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden mb-8">
            <Image
              src={aboutimage}
              alt="Damned Designs workshop"
              className="w-full h-full object-cover"
              width={1920}
              height={1080}
            />
          </div>

          {/* Content */}
          <div className="prose max-w-none">
            <h2 className="text-2xl font-bold mt-8 mb-4">Our Story</h2>
            <p>
              Damned Designs was founded in 2015 by Adrian D'Souza, a passionate knife enthusiast
              with a vision to create exceptional everyday carry tools that combine innovative design,
              premium materials, and superior craftsmanship.
            </p>
            <p>
              What began as a small workshop in Adrian's garage has grown into a respected brand in
              the EDC community, known for pushing boundaries and challenging conventional knife design
              while maintaining the highest standards of quality and performance.
            </p>

            <h2 className="text-2xl font-bold mt-8 mb-4">Our Philosophy</h2>
            <p>
              At Damned Designs, we believe that the tools you carry every day should be as exceptional
              as the people who carry them. We're committed to creating products that are not only
              functional and reliable but also beautiful and inspiring.
            </p>
            <p>
              Each knife we create is a perfect balance of form and function, designed to be used and
              appreciated for years to come. We take pride in our attention to detail, our innovative
              approach to design, and our unwavering commitment to quality.
            </p>

            <h2 className="text-2xl font-bold mt-8 mb-4">Our Process</h2>
            <p>
              Every Damned Designs product begins as a concept, carefully sketched and refined until it
              meets our exacting standards. We then create detailed 3D models and prototypes, testing and
              iterating until we achieve the perfect balance of aesthetics, ergonomics, and performance.
            </p>
            <p>
              We work with skilled manufacturers who share our passion for quality and precision, using
              only the finest materials and the most advanced production techniques. Each knife undergoes
              rigorous quality control before it bears the Damned Designs name.
            </p>

            <h2 className="text-2xl font-bold mt-8 mb-4">Our Community</h2>
            <p>
              We're proud to be part of the vibrant and passionate EDC community. We value the feedback
              and support of our customers, and we're constantly inspired by the ways they use and
              appreciate our products.
            </p>
            <p>
              We're committed to giving back to this community through collaborations with artists and
              makers, support for knife shows and events, and our ongoing efforts to innovate and
              elevate the world of everyday carry tools.
            </p>
          </div>

          {/* Values & Contact */}
          <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-gray-100 p-8 rounded-lg">
              <h3 className="text-xl font-bold mb-4">Our Values</h3>
              <ul className="list-disc pl-5 space-y-2">
                <li>Innovation in design and materials</li>
                <li>Uncompromising quality and craftsmanship</li>
                <li>Functionality and performance</li>
                <li>Transparency and integrity</li>
                <li>Community engagement and support</li>
              </ul>
            </div>

            <div className="bg-gray-100 p-8 rounded-lg">
              <h3 className="text-xl font-bold mb-4">Contact Us</h3>
              <p className="mb-6">
                We love hearing from our customers and the EDC community. Whether you have questions
                about our products, feedback on your purchase, or ideas for future designs, we'd love
                to hear from you.
              </p>
              <Link href="/contact" className="text-white bg-black hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-[5px] text-sm px-[40px] py-[18px] me-2 mb-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700 text-center ">
                Get in Touch
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
