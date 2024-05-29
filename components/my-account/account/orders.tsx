import Link from "next/link";

export default function Orders() {
    return (
        <div className="flex justify-between">
            <p>No order has been made yet.</p>
            <Link href="/shop" className="px-5 py-3 border border-[#333] hover:bg-slate-100 hover:border-slate-100">Browse products</Link>
        </div>
    )
}