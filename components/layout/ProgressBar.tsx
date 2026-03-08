"use client";

import { useEffect, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";

export default function ProgressBar() {
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        // When the path or search params change, we stop the loading state
        setLoading(false);
    }, [pathname, searchParams]);

    // We can't easily detect the "start" of a transition with standard Next.js Link
    // without wrapping them, but we can detect when the page is actually unloading/changing.
    useEffect(() => {
        const handleClick = (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            const anchor = target.closest("a");

            if (anchor && anchor.href && anchor.target !== "_blank") {
                const url = new URL(anchor.href);
                // Only show loader for internal links that are different from current page
                if (url.origin === window.location.origin && url.href !== window.location.href) {
                    setLoading(true);
                }
            }
        };

        document.addEventListener("click", handleClick);
        return () => document.removeEventListener("click", handleClick);
    }, []);

    if (!loading) return null;

    return <div className="loading-progress" />;
}
