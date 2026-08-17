"use client";

import { SessionProvider } from "next-auth/react";
import { Toaster } from "sonner";

export function Providers({ children }) {
    return (
        <SessionProvider>
            {children}
            <Toaster
                position="bottom-right"
                expand={false}
                richColors
                theme="dark"
                toastOptions={{
                    style: {
                        background: '#161616',
                        border: '1px solid #262626',
                        borderRadius: '20px',
                        color: '#fff',
                        fontFamily: 'var(--font-inter)',
                    },
                }}
            />
        </SessionProvider>
    );
}
