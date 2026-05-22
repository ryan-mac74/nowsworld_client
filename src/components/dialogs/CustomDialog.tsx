import React, { useEffect } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import { cn } from "@/lib/tailwind-merge";

type DialogProps = {
    isOpen: boolean;
    onClose: () => void;
    children: React.ReactNode;
    className?: string;
};

export default function CustomDialog({ isOpen, onClose, children, className }: DialogProps) {
    useEffect(() => {
        if (isOpen) {
            const originalOverflow = document.body.style.overflow;
            document.body.style.overflow = "hidden";

            return () => {
                document.body.style.overflow = originalOverflow;
            };
        }
    }, [isOpen]);

    if (!isOpen || typeof document === "undefined") {
        return null;
    }

    return createPortal(
        <div className="fixed inset-0 z-[100] flex items-center justify-center">
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            />

            <div
                className={cn(
                    "relative max-w-2xl mx-auto w-[80%] max-h-[80vh]",
                    "bg-white dark:bg-neutral-900 rounded-lg shadow-2xl dark:shadow-neutral-900/50",
                    "overflow-hidden flex flex-col",
                    className
                )}
            >
                <button
                    onClick={onClose}
                    className={cn(
                        "absolute top-2 left-2 p-0.5 bg-black/10 dark:bg-white/10",
                        "hover:bg-black/20 dark:hover:bg-white/20",
                        "z-10 rounded-full transition-colors"
                    )}
                    aria-label="Close Dialog"
                >
                    <X className="w-8 h-8 text-red-600 dark:text-red-400" />
                </button>

                <div className="flex-1 overflow-auto w-full h-full relative flex">
                    <div className="m-auto w-full max-w-full">
                        {children}
                    </div>
                </div>
            </div>
        </div>,
        document.body
    );
}
