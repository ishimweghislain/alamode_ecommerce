export default function ShopLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex-grow">
            {children}
        </div>
    );
}
