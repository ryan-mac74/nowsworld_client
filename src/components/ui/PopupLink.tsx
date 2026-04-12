import React from "react";
import { cn } from "@/lib/tailwind-merge";

type PopupLinkProps = {
    href: string;
    children: React.ReactNode;
    className?: string;
};

export default function PopupLink({ href, children, className }: PopupLinkProps) {
    return (
        <a
            href={href}
            onClick={(e) => {
                e.preventDefault();

                const isExternal = href.startsWith("http") || href.startsWith("www.");

                if (isExternal) {
                    // External link: open safely in a standard new browser tab
                    const finalHref = href.startsWith("www.") ? `https://${href}` : href;
                    window.open(finalHref, "_blank", "noopener,noreferrer");
                } else {
                    // Local file: open in a centered dynamic popup based on screen size
                    const width = Math.round(window.screen.width * 0.8); // 80% of screen width
                    const height = Math.round(window.screen.height * 0.8); // 80% of screen height
                    const left = Math.round((window.screen.width - width) / 2);
                    const top = Math.round((window.screen.height - height) / 2);

                    window.open(
                        href,
                        "popup",
                        `toolbar=no,scrollbars=yes,resizable=yes,top=${top},left=${left},width=${width},height=${height}`
                    );
                }
            }}
            className={cn(
                "break-all cursor-pointer font-bold text-blue-500",
                "hover:text-neutral-800 dark:hover:text-neutral-200",
                "transition-all underline underline-offset-4 decoration-transparent",
                "hover:decoration-neutral-400 dark:hover:decoration-neutral-600",
                className
            )}
        >
            {children}
        </a>
    );
}
