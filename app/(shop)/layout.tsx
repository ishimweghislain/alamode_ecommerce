import Footer from "@/components/layout/Footer";
import BottomNav from "@/components/layout/BottomNav";

import Navbar from "@/components/layout/Navbar";

export default function ShopLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <>
            <Navbar />
            <div className="flex-grow">
                {children}
            </div>
            <Footer />
            <BottomNav />
        </>
    );
}
