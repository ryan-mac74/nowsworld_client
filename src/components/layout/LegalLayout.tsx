import React from "react";

type LegalLayoutProps = {
  title: string;
  children: React.ReactNode;
};

export default function LegalLayout({ title, children }: LegalLayoutProps) {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50">
      <div className="max-w-2xl mx-auto shadow-md rounded-2xl p-8 bg-white">
        <h1 className="text-2xl font-bold mb-4 text-gray-900">{title}</h1>
        <div className="space-y-4 text-gray-700 text-sm leading-relaxed">
          {children}
        </div>
      </div>
    </div>
  );
}
