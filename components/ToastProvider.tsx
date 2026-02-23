"use client";

import { Toaster } from "react-hot-toast";

export const ToastProvider = () => {
    return (
        <Toaster
            position="top-right"
            toastOptions={{
                style: {
                    background: "#1E293B",
                    color: "#fff",
                    border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: "0.75rem",
                },
                success: {
                    iconTheme: {
                        primary: "#10B981",
                        secondary: "#fff",
                    },
                },
                error: {
                    iconTheme: {
                        primary: "#EF4444",
                        secondary: "#fff",
                    },
                },
            }}
        />
    );
};
