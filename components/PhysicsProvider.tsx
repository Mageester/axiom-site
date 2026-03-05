"use client";

import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "@studio-freight/lenis";

let scrollTriggerRegistered = false;

export default function PhysicsProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    if (!scrollTriggerRegistered) {
      gsap.registerPlugin(ScrollTrigger);
      scrollTriggerRegistered = true;
    }

    const lenis = new Lenis({
      lerp: 0.05,
      wheelMultiplier: 1.1,
      infinite: false,
      smoothWheel: true,
      syncTouch: true,
    });

    const ticker = (time: number) => {
      lenis.raf(time * 1000);
    };

    lenis.on("scroll", ScrollTrigger.update);
    gsap.ticker.add(ticker);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(ticker);
      lenis.off("scroll", ScrollTrigger.update);
      lenis.destroy();
    };
  }, []);

  return <>{children}</>;
}
