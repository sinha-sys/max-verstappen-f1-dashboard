"use client";

// Force dynamic rendering
export const dynamic = 'force-dynamic';

import dynamicImport from "next/dynamic";
import { useEffect, useState } from "react";

// Dynamically import the dashboard with no SSR
const DashboardPage = dynamicImport(() => import("./(dashboard)/page"), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
    </div>
  ),
});

export default function HomePage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return <DashboardPage />;
}
