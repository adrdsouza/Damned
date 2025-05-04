import Link from "next/link";

export const metadata = {
  title: "Return & Refund Policy | Damned Designs",
  description:
    "Read our return and refund policy for information on how to return defected products purchased from Damned Designs.",
};

export default function ReturnPolicyPage() {
  return (
    <main className="flex-grow px-[10px] md:px-[40px]">
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
          <span>Return & Refund Policy</span>
        </div>
          <h1 className="text-4xl font-bold mb-8">Return & Refund Policy</h1>

          <div className="space-y-10 text-gray-800">
            <section>
              <p id="returns-Shipping">
                Thanks for shopping at <strong>Damned Designs</strong>. We stand behind our products and offer an exchange or refund against manufacturing defects.
              </p >
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">Returns</h2>
              <p className="mb-4">
                Please send us an email, no later than 3 calendar days from the date the item was received with proof of the defect. If the product can be restored to perfect condition by replacing a part, we will ship out the necessary part to you. We reserve the right to accept the return.
              </p>
              <p className="mb-4">
                If a return is authorized, you can choose to receive a replacement (if available) or a refund. Your item must be unused and in the same condition that you received it and in its original packaging.
              </p>
              <p className="mb-4">
                Once we receive your item, we will inspect it and notify you that we have received your returned item. We will immediately notify you on the status of your refund after inspecting the item.
              </p>
              <p className="mb-4">
                If your return is approved, we will initiate a refund to your credit card (or original method of payment). If a replacement is requested, it will be shipped out immediately.
              </p>
              <p >
                You will receive the credit within a certain amount of days, depending on your card issuer's policies.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">Shipping</h2>
              <p className="mb-4">
                Since we pride ourselves in the quality of our products, we will send you a prepaid return label to return your defected product. Original shipping charges will be returned as well (unless there were multiple items on the order).
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">Contact Us</h2>
              <p>
                If you have any questions on how to return your item to us, please send us an email at{" "}
                <a href="mailto:info@damneddesigns.com" className="text-primary hover:underline">
                  info@damneddesigns.com
                </a>
                .
              </p>
            </section>
          </div>
        </div>
      </div>
    </main>
  );
}
