import { responsiveImages, type ResponsiveSource } from './responsiveImages';

type ProofImageConfig = {
  source: ResponsiveSource;
  alt?: string;
  position?: string;
};

const proofImagesBySlug: Record<string, ProofImageConfig> = {
  'demonstration-restaurant-reservation-site': {
    source: responsiveImages.workRestaurant,
    alt: 'Server presenting plated dishes in a warmly lit dining room',
    position: 'center 24%',
  },
  'concept-landscaping-authority-site': {
    source: responsiveImages.workLandscaping,
    alt: 'Premium residential exterior with strong curb appeal and outdoor project framing',
    position: 'center 52%',
  },
  'concept-roofing-conversion-site': {
    source: responsiveImages.workRoofing,
    alt: 'Roofing crew working on a residential roof during an active exterior project',
    position: 'center 36%',
  },
};

export function getWorkProofImage(slug: string): ProofImageConfig {
  return proofImagesBySlug[slug] ?? { source: responsiveImages.workAether };
}
