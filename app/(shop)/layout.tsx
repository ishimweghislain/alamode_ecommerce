import Footer from "@/components/layout/Footer";
import BottomNav from "@/components/layout/BottomNav";

export default function ShopLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <>
            <div className="flex-grow">
                {children}
            </div>
            <Footer />
            <BottomNav />
        </>
    );
}
