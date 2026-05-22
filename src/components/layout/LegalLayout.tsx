import React from "react";

type LegalLayoutProps = {
  title: string;
  children: React.ReactNode;
};

export default function LegalLayout({ title, children }: LegalLayoutProps) {
  return (
    <div className="w-full min-h-screen flex items-center justify-center p-2 bg-white dark:bg-neutral-900">
      <div className="w-full max-w-2xl mx-auto shadow-lg rounded-2xl p-4 border dark:border-none bg-white dark:bg-neutral-800">
        <h1 className="text-2xl font-bold mb-4 text-neutral-900 dark:text-neutral-100">
          {title}
        </h1>
        <div className="space-y-4 text-neutral-700 dark:text-neutral-300 text-sm leading-relaxed">
          {children}
        </div>
      </div>
    </div>
  );
}
