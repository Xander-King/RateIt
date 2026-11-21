"use client";

import { useEffect, useRef } from "react";
import { useRouter, usePathname } from "next/navigation";

export default function BackButton() {
    const router = useRouter();
    const pathname = usePathname();
    const skippingLogin = useRef(false);

    useEffect(() => {
        if (skippingLogin.current) {
            skippingLogin.current = false;
            if (pathname === "/login" || pathname === "/ResetPassword" || pathname === "/signup") {
                router.push('/home');
            }
        }
    }, [pathname, router]);

    function handleClick() {
        skippingLogin.current = true;
        router.back();
    }

    return (
        <button
            type="button"
            onClick={handleClick}
            aria-label="Go back"
            className="icon-btn"
        >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 12H5" />
                <path d="M12 19l-7-7 7-7" />
            </svg>
        </button>
    );
}
