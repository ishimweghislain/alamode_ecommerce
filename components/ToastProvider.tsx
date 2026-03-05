"use client";

import { Toaster } from "react-hot-toast";

export const ToastProvider = () => {
    return (
        <Toaster
            position="top-right"
            containerStyle={{ zIndex: 99999 }}
            toastOptions={{
                duration: 4000,
                style: {
                    background: "rgba(12, 12, 12, 0.8)",
                    backdropFilter: "blur(12px)",
                    color: "#fff",
                    border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: "1rem",
                    padding: "16px 20px",
                    fontSize: "14px",
                    fontWeight: "500",
                    boxShadow: "0 20px 40px rgba(0,0,0,0.6)",
                    maxWidth: "400px",
                },
                success: {
                    iconTheme: {
                        primary: "#D4AF37",
                        secondary: "#000",
                    },
                    style: {
                        borderLeft: "4px solid #D4AF37",
                    }
                },
                error: {
                    iconTheme: {
                        primary: "#EF4444",
                        secondary: "#fff",
                    },
                    style: {
                        borderLeft: "4px solid #EF4444",
                    }
                },
            }}
        />
    );
};
