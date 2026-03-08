export type ResponsiveSource = {
  fallbackSrc: string;
  avifSrcSet: string;
  webpSrcSet: string;
};

export const responsiveImages = {
  workAether: {
    fallbackSrc: '/images/work-aether.jpg',
    avifSrcSet:
      '/images/work-aether-640.avif 640w, /images/work-aether-960.avif 960w, /images/work-aether-1280.avif 1280w',
    webpSrcSet:
      '/images/work-aether-640.webp 640w, /images/work-aether-960.webp 960w, /images/work-aether-1280.webp 1280w',
  },
  caseStudy1: {
    fallbackSrc: '/images/case-study-1.jpg',
    avifSrcSet:
      '/images/case-study-1-640.avif 640w, /images/case-study-1-960.avif 960w, /images/case-study-1-1280.avif 1280w',
    webpSrcSet:
      '/images/case-study-1-640.webp 640w, /images/case-study-1-960.webp 960w, /images/case-study-1-1280.webp 1280w',
  },
  caseStudy2: {
    fallbackSrc: '/images/case-study-2.jpg',
    avifSrcSet:
      '/images/case-study-2-640.avif 640w, /images/case-study-2-960.avif 960w, /images/case-study-2-1280.avif 1280w',
    webpSrcSet:
      '/images/case-study-2-640.webp 640w, /images/case-study-2-960.webp 960w, /images/case-study-2-1280.webp 1280w',
  },
  caseStudy3: {
    fallbackSrc: '/images/case-study-3.jpg',
    avifSrcSet:
      '/images/case-study-3-480.avif 480w, /images/case-study-3-800.avif 800w, /images/case-study-3-1120.avif 1120w',
    webpSrcSet:
      '/images/case-study-3-480.webp 480w, /images/case-study-3-800.webp 800w, /images/case-study-3-1120.webp 1120w',
  },
  caseStudy4: {
    fallbackSrc: '/images/case-study-4.jpg',
    avifSrcSet:
      '/images/case-study-4-480.avif 480w, /images/case-study-4-800.avif 800w, /images/case-study-4-1120.avif 1120w',
    webpSrcSet:
      '/images/case-study-4-480.webp 480w, /images/case-study-4-800.webp 800w, /images/case-study-4-1120.webp 1120w',
  },
  logoClear: {
    fallbackSrc: '/photos/logoclear.png',
    avifSrcSet: '/photos/logoclear-320.avif 320w, /photos/logoclear-512.avif 512w, /photos/logoclear-768.avif 768w',
    webpSrcSet: '/photos/logoclear-320.webp 320w, /photos/logoclear-512.webp 512w, /photos/logoclear-768.webp 768w',
  },
} as const satisfies Record<string, ResponsiveSource>;

export type ResponsiveImageKey = keyof typeof responsiveImages;
