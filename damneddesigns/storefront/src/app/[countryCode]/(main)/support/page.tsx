import Link from "next/link";

export const metadata = {
  title: "Support Center | Damned Designs",
  description:
    "Get help with your Damned Designs orders, products, warranty, and more. Browse FAQs or contact our support team for assistance.",
};

export default function SupportPage() {
  return (
    <main className="flex-grow  px-[10px] md:px-[40px]">
      <div className="container py-12">
       

        <div className="max-w-4xl mx-auto">
        <div className="flex items-center text-sm mb-6">
          <Link href="/" className="hover:underline">Home</Link>
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"
            viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
            strokeLinecap="round" strokeLinejoin="round"
            className="lucide-icon lucide lucide-chevron-right mx-2">
            <path d="m9 18 6-6-6-6" />
          </svg>
          <span>Support</span>
        </div>
          <h1 className="text-4xl font-bold mb-8" id="faq">Support Center</h1>

          {/* Help Section */}
          <div className="space-y-8"  >
         

            {/* FAQs */}
            <section>
              <h2 className="text-2xl font-bold mb-6">Frequently Asked Questions</h2>
              <div className="space-y-4">
                {[
                  {
                    q: "What payment methods do you accept?",
                    a: "We accept all major credit cards (Visa, MasterCard, American Express) and PayPal. All transactions are processed securely through our payment providers.",
                    id:"shipping"
                  },
                  {
                    q: "What is your shipping policy?",
                    a: "We offer free shipping on orders over $100 within the United States. International shipping rates vary by location. Most orders are processed within 1-2 business days.",
                    id:"policy"
                  },
                  {
                    q: "What is your return policy?",
                    a: "We offer a 30-day return policy for unused items in their original packaging. Custom orders are non-returnable. Please contact us for a return authorization before sending any items back.",
                    id:"returnpolicy"
                  },
                  {
                    q: "How do I care for my knife?",
                    a: "Keep your knife clean and dry after use. Use appropriate lubricant for the pivot and moving parts. Store in a dry place. Avoid exposure to moisture and corrosive materials.",
                    id:"myknif"
                  },
                ].map((faq, index) => (
                  <div key={index} className="bg-white p-6 rounded-lg shadow-sm">
                    <h3 className="font-bold mb-2" id={faq?.id}>{faq.q}</h3>
                    <p className="text-gray-700">{faq.a}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* Contact Section */}
            <section>
              <h2 className="text-2xl font-bold mb-6">Contact Us</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-lg shadow-sm">
                  <h3 className="font-bold mb-4">Email Support</h3>
                  <p className="text-gray-700 mb-4">For general inquiries and support:</p>
                  <Link href="mailto:Info@damneddesigns.com" className="text-primary hover:underline">
                    Info@damneddesigns.com
                  </Link>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-sm">
                  <h3 className="font-bold mb-4" id="warranty">Phone Support</h3>
                  <p className="text-gray-700 mb-4">Available Monday-Friday, 9am-5pm EST:</p>
                  <Link href="tel:+1-555-123-4567" className="text-primary hover:underline">
                    +1 3376029228
                  </Link>
                </div>
              </div>
            </section>

     

            {/* Warranty Info */}
            <section >
              <h2 className="text-2xl font-bold mb-6">Warranty Information</h2>
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <p className="text-gray-700 mb-4">
                  All Damned Designs knives come with a lifetime warranty against manufacturing defects. This warranty covers:
                </p>
                <ul className="list-disc pl-5 space-y-2 text-gray-700">
                  <li>Material defects</li>
                  <li>Manufacturing defects</li>
                  <li>Mechanical issues</li>
                </ul>
                <p className="text-gray-700 mt-4">
                  The warranty does not cover damage from misuse, abuse, or normal wear and tear.
                  For warranty claims, please contact our support team with photos and a description of the issue.
                </p>
              </div>
            </section>
          </div>
        </div>
      </div>
    </main>
  );
}
