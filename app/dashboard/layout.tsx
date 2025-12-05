"use client";

import dynamic from "next/dynamic";
import { NetworkStatus } from "@/components/ui/NetworkStatus";
import { NoSSR } from "@/components/providers/NoSSR";

// Dynamically import 3D background to avoid SSR
const ThreeDBackground = dynamic(
  () =>
    import("@/components/3d/Background").then((mod) => mod.ThreeDBackground),
  {
    ssr: false,
    loading: () => (
      <div className="fixed inset-0 z-0 bg-gradient-to-br from-gray-900 via-black to-gray-900" />
    ),
  }
);

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      {/* 3D Background only for dashboard */}
      <div className="fixed inset-0 z-0">
        <ThreeDBackground />
      </div>

      {/* Main Content */}
      <div className="relative z-10">
        <NoSSR>
          <NetworkStatus />
        </NoSSR>
        <main className="min-h-screen p-4 md:p-8">{children}</main>
      </div>
    </>
  );
}
