"use client";
import React from 'react';
import { Loader } from "@/components/ui/loader";

export function FullPageLoader() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] p-8">
      <div className="text-2xl font-bold mb-8">crmX</div>
      <Loader size="lg" />
    </div>
  );
}
