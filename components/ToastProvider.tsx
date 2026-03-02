"use client";

import { Toaster } from "react-hot-toast";

export const ToastProvider = () => {
    return (
        <Toaster
            position="top-right"
            containerStyle={{ zIndex: 99999 }}
            toastOptions={{
                style: {
                    background: "#1E293B",
                    color: "#fff",
                    border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: "0.75rem",
                    boxShadow: "0 10px 30px rgba(0,0,0,0.5)",
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
