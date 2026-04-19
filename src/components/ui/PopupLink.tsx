import React, { useState } from "react";
import { cn } from "@/lib/tailwind-merge";
import CustomDialog from "@/components/dialogs/CustomDialog";

type PopupLinkProps = {
    href: string;
    children: React.ReactNode;
    className?: string;
};

export default function PopupLink({ href, children, className }: PopupLinkProps) {
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const isImage = /\.(jpeg|jpg|gif|png|webp|svg|avif|bmp|ico)(\?.*)?$/i.test(href);
    const isVideo = /\.(mp4|webm|ogg|mov)(\?.*)?$/i.test(href);
    const isAudio = /\.(mp3|wav|flac|m4a|aac)(\?.*)?$/i.test(href);
    const isPdf = /\.pdf(\?.*)?$/i.test(href);

    return (
        <>
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
                        // Local file: open in a custom dialog to prevent bad mobile behavior
                        setIsDialogOpen(true);

                        /*
                        
                        const width = Math.round(window.screen.width * 0.8); // 80% of screen width
                        const height = Math.round(window.screen.height * 0.8); // 80% of screen height
                        const left = Math.round((window.screen.width - width) / 2);
                        const top = Math.round((window.screen.height - height) / 2);

                        window.open(
                            href,
                            "popup",
                            `toolbar=no,scrollbars=yes,resizable=yes,top=${top},left=${left},width=${width},height=${height}`
                        );
                            
                        */
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

            <CustomDialog isOpen={isDialogOpen} onClose={() => setIsDialogOpen(false)}>
                {isImage ? (
                    <img
                        src={href} alt="Local Images"
                        className="block m-auto max-w-full h-auto rounded-lg shadow-lg"
                    />
                ) : isVideo ? (
                    <video
                        src={href} controls
                        className="block m-auto w-full max-w-full h-auto rounded-lg shadow-lg bg-black"
                    />
                ) : isAudio ? (
                    <div className="
                            flex items-center justify-center w-full h-40 
                            bg-neutral-200 dark:bg-neutral-800 rounded-lg shadow-lg 
                            border border-neutral-300 dark:border-neutral-700
                        "
                    >
                        <audio
                            src={href} controls
                            className="w-full max-w-xs outline-none"
                        />
                    </div>
                ) : (
                    <div className="w-full h-[80vh] bg-white dark:bg-neutral-900 rounded-lg overflow-hidden isolate relative">
                        {isPdf ? (
                            <object
                                data={href} type="application/pdf"
                                className="w-full h-full border-none block rounded-lg"
                            >
                                <iframe
                                    src={href} title="PDF Document"
                                    className="w-full h-full border-none block bg-white dark:bg-neutral-900 rounded-lg"
                                />
                            </object>
                        ) : (
                            <iframe
                                src={href} title="Local Pages"
                                className="w-full h-full border-none block bg-white dark:bg-neutral-900 rounded-lg" />
                        )}
                    </div>
                )}
            </CustomDialog>
        </>
    );
}
