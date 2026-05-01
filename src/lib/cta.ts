export const CTA_PATHS = {
    startProject: '/start-a-project',
    work: '/work',
    process: '/process',
    contact: '/contact'
} as const;

export const CTA_LABELS = {
    primary: 'Start a project',
    work: 'See the Work',
    process: 'See the process',
    contact: 'Contact',
    review: 'Request review',
    demo: 'Open build',
    liveSite: 'Open live site'
} as const;

export const CTA = {
    primary: {
        label: CTA_LABELS.primary,
        to: CTA_PATHS.startProject
    },
    work: {
        label: CTA_LABELS.work,
        to: CTA_PATHS.work
    },
    process: {
        label: CTA_LABELS.process,
        to: CTA_PATHS.process
    },
    contact: {
        label: CTA_LABELS.contact,
        to: CTA_PATHS.contact
    },
    review: {
        label: CTA_LABELS.review,
        to: CTA_PATHS.startProject
    }
} as const;

export const createStartProjectHref = (pathIntent?: string) => {
    if (!pathIntent) return CTA_PATHS.startProject;
    return `${CTA_PATHS.startProject}?path=${encodeURIComponent(pathIntent)}`;
};
