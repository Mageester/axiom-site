"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import Link from "next/link";

const navItems = [
  { label: "Infrastructure", href: "#" },
  { label: "Deployments", href: "#" },
  { label: "Architects", href: "#" },
];

export default function Navbar() {
  const navRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const targets = gsap.utils.toArray<HTMLElement>("[data-nav-reveal]");
      gsap.fromTo(
        targets,
        { opacity: 0, y: -20 },
        {
          opacity: 1,
          y: 0,
          delay: 0.2,
          duration: 0.8,
          stagger: 0.08,
          ease: "power3.out",
        },
      );
    }, navRef);

    return () => ctx.revert();
  }, []);

  return (
    <header ref={navRef} className="fixed inset-x-0 top-0 z-50 border-b border-white/10 bg-[#0d1323]/70 backdrop-blur-xl">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center" data-nav-reveal>
            <img
              src="/photos/logoclear.png"
              alt="Axiom Infrastructure"
              className="h-10 md:h-12 w-auto object-contain cursor-pointer transition-transform duration-300 hover:scale-105"
            />
          </Link>
          <div className="flex items-center gap-6">
            {navItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                data-nav-reveal
                className="text-sm uppercase tracking-[0.24em] text-white/75 transition-colors duration-200 hover:text-[#B05D41]"
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </nav>
    </header>
  );
}
