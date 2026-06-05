/// <reference types="vite/client" />

declare global {
  interface Window {
    __lenis?: import('lenis').default | null;
    __axiomCursorTrackerBound?: boolean;
    __axiomScrollBound?: boolean;
  }
}

export {};
