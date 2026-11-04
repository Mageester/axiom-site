export type ResponsiveSource = {
  fallbackSrc: string;
  width: number;
  height: number;
  avifSrcSet?: string;
  webpSrcSet: string;
};

export const responsiveImages = {
  workReids: {
    fallbackSrc: '/images/work-reids-1200.webp',
    width: 1200,
    height: 800,
    avifSrcSet: '/images/work-reids-640.avif 640w, /images/work-reids-960.avif 960w, /images/work-reids-1200.avif 1200w',
    webpSrcSet: '/images/work-reids-640.webp 640w, /images/work-reids-960.webp 960w, /images/work-reids-1200.webp 1200w',
  },
  logoClear: {
    fallbackSrc: '/photos/logoclear.png',
    width: 515,
    height: 163,
    avifSrcSet: '/photos/logoclear-320.avif 320w, /photos/logoclear-512.avif 512w, /photos/logoclear-768.avif 768w',
    webpSrcSet: '/photos/logoclear-320.webp 320w, /photos/logoclear-512.webp 512w, /photos/logoclear-768.webp 768w',
  },
  founderAidan: {
    fallbackSrc: '/images/team-mark.jpg',
    width: 1024,
    height: 1024,
    avifSrcSet: '/images/team-mark.jpg',
    webpSrcSet: '/images/team-mark.jpg',
  },
  founderRiley: {
    fallbackSrc: '/images/team-mark.jpg',
    width: 1024,
    height: 1024,
    avifSrcSet: '/images/team-mark.jpg',
    webpSrcSet: '/images/team-mark.jpg',
  },
} as const satisfies Record<string, ResponsiveSource>;

/** The preview of a concept demo, captured from the running page by scripts/capture-work.mjs. */
export const workPreview = (slug: string): ResponsiveSource => ({
  fallbackSrc: `/images/work/${slug}-960.webp`,
  width: 1600,
  height: 1000,
  webpSrcSet: `/images/work/${slug}-960.webp 960w, /images/work/${slug}-1600.webp 1600w`,
});

export type ResponsiveImageKey = keyof typeof responsiveImages;
