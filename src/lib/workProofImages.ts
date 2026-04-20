import { responsiveImages, type ResponsiveSource } from './responsiveImages';

type ProofImageConfig = {
  source: ResponsiveSource;
  alt?: string;
  position?: string;
};

const proofImagesBySlug: Record<string, ProofImageConfig> = {
  'concept-dental-demo': {
    source: responsiveImages.workDental,
    alt: 'Premium dental clinic interior with modern equipment and calm aesthetic',
    position: 'center 40%',
  },
  'concept-barber-demo': {
    source: responsiveImages.workBarber,
    alt: 'Professional barbershop interior with sharp branding and luxury feel',
    position: 'center 40%',
  },
  'concept-salon-demo': {
    source: responsiveImages.workSalon,
    alt: 'Premium nail studio interior with modern equipment and polished aesthetic',
    position: 'center 40%',
  },
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
