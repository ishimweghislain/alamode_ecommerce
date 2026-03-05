"use client";

import { useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";

function RegisterRedirect() {
    const router = useRouter();
    const searchParams = useSearchParams();

    useEffect(() => {
        const params = new URLSearchParams(searchParams.toString());
        params.set("mode", "register");
        router.replace(`/login?${params.toString()}`);
    }, [router, searchParams]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-background-dark">
            <div className="flex flex-col items-center gap-4">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-brand-accent"></div>
                <p className="text-gray-400 font-medium">Redirecting to secure registration...</p>
            </div>
        </div>
    );
}

export default function RegisterPage() {
    return (
        <Suspense fallback={null}>
            <RegisterRedirect />
        </Suspense>
    );
}
