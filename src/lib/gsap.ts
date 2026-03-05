import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

let isRegistered = false;

export function registerGsapPlugins() {
  if (isRegistered) return;
  gsap.registerPlugin(ScrollTrigger, useGSAP);
  isRegistered = true;
}

