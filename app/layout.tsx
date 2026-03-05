import type { Metadata } from "next";
import "./globals.css";
import PhysicsProvider from "@/components/PhysicsProvider";
import Navbar from "@/components/Navbar";

export const metadata: Metadata = {
  title: "Axiom Infrastructure",
  description: "Hyper-kinetic digital systems for elite brands.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="overflow-x-hidden">
      <body className="overflow-x-hidden bg-[#0d1323] text-white antialiased">
        <PhysicsProvider>
          <Navbar />
          {children}
        </PhysicsProvider>
      </body>
    </html>
  );
}
