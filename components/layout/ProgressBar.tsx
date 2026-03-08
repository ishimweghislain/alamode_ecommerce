"use client";

import { useEffect, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";

import { Suspense } from "react";

function ProgressBarContent() {
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setLoading(false);
    }, [pathname, searchParams]);

    useEffect(() => {
        const handleClick = (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            const anchor = target.closest("a");

            if (anchor && anchor.href && anchor.target !== "_blank") {
                const url = new URL(anchor.href);
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

export default function ProgressBar() {
    return (
        <Suspense fallback={null}>
            <ProgressBarContent />
        </Suspense>
    );
}
