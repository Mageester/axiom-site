import type { ContactValidation } from './omniscient-email';

export interface PainSignal {
    type: 'CONVERSION' | 'SPEED' | 'TRUST' | 'SEO' | 'NO_WEBSITE' | 'DESIGN' | 'FUNCTIONALITY';
    severity: number;
    evidence: string;
    source: 'site_scan' | 'ai_analysis' | 'heuristic' | 'maps_data';
}

export interface WebsiteAssessment {
    speedRisk: number;
    conversionRisk: number;
    trustRisk: number;
    seoRisk: number;
    overallGrade: string;
    topFixes: string[];
}

export interface ScoreBreakdown {
    businessValue: number;
    painOpportunity: number;
    reachability: number;
    localFit: number;
}

export interface AxiomScoreResult {
    axiomScore: number;
    tier: string;
    breakdown: ScoreBreakdown;
    painSignals: PainSignal[];
}

export interface DisqualifyResult {
    disqualified: boolean;
    reasons: string[];
    primaryReason: string | null;
}

export interface PersonalizationResult {
    callOpener: string;
    followUpQuestion: string;
}

const HIGH_LTV_INDUSTRIES = [
    'dentist', 'dental', 'orthodont',
    'med spa', 'med-spa', 'medspa', 'medical spa', 'aesthetic',
    'law', 'lawyer', 'attorney', 'legal',
    'roofing', 'roofer',
    'hvac', 'heating', 'cooling', 'air conditioning',
    'plumb', 'plumber', 'plumbing',
    'electric', 'electrician',
    'landscap', 'lawn',
    'auto', 'car detailing', 'auto detailing',
    'home renovation', 'renovation', 'remodel',
    'concrete', 'paving', 'asphalt',
    'clinic', 'private clinic', 'physiother', 'chiropr',
    'cabinet', 'custom cabinet', 'kitchen',
    'pool', 'hot tub',
    'solar', 'solar panel',
    'real estate', 'realtor',
    'cleaning', 'commercial cleaning', 'janitorial',
    'pest control',
    'moving', 'mover',
    'garage door',
    'fencing', 'fence',
    'tree service', 'arborist',
    'painting', 'painter',
    'flooring',
    'window', 'door',
    'siding',
    'insulation',
    'demolition',
    'excavat',
    'vet', 'veterinar',
    'optom', 'eye',
];

const AXIOM_PRIORITY_CITIES = [
    'kitchener', 'waterloo', 'cambridge', 'guelph',
    'hamilton', 'london', 'brantford', 'stratford',
    'woodstock', 'st. catharines', 'niagara falls',
    'burlington', 'oakville', 'milton', 'brampton',
    'mississauga', 'toronto', 'barrie',
];

const AXIOM_CORE_CITIES = [
    'kitchener', 'waterloo', 'cambridge', 'guelph',
    'hamilton', 'london',
];

const LOW_ROI_INDUSTRIES = [
    'food truck', 'lemonade', 'babysit',
    'garage sale', 'flea market', 'thrift',
    'tutoring', 'freelanc',
    'nonprofit', 'non-profit', 'charity',
    'church', 'worship',
];

const FRANCHISE_INDICATORS = [
    'franchise', 'franchised', 'all rights reserved',
    'corporate headquarters', 'national brand',
];

function normalizeName(name: string): string {
    return name
        .toLowerCase()
        .trim()
        .replace(/\b(inc|ltd|llc|corp|co|company|group|services|service|enterprise|enterprises)\b\.?/gi, '')
        .replace(/[''"".,\-&!@#$%^*()_+=\[\]{}|\\/<>:;?~`]/g, '')
        .replace(/\s+/g, ' ')
        .trim();
}

function extractDomain(url: string | null | undefined): string | null {
    if (!url || url.trim().length === 0) return null;
    try {
        const u = new URL(url.startsWith('http') ? url : `https://${url}`);
        return u.hostname.replace('www.', '').toLowerCase();
    } catch {
        return null;
    }
}

function normalizePhone(phone: string | null | undefined): string | null {
    if (!phone || phone.trim().length === 0) return null;
    const digits = phone.replace(/\D/g, '');
    if (digits.length === 11 && digits.startsWith('1')) return digits.substring(1);
    if (digits.length === 10) return digits;
    return null;
}

function normalizeAddress(address: string | null | undefined): string | null {
    if (!address || address.trim().length === 0) return null;
    return address
        .toLowerCase()
        .replace(/\b(unit|suite|ste|apt|#)\s*\S+/gi, '')
        .replace(/[.,#]/g, '')
        .replace(/\s+/g, ' ')
        .trim() || null;
}

function scoreBusinessValue(
    niche: string,
    category: string,
    rating: number,
    reviewCount: number,
    websiteContent: string,
): number {
    let score = 0;
    const lower = `${niche} ${category}`.toLowerCase();
    const isHighLtv = HIGH_LTV_INDUSTRIES.some((industry) => lower.includes(industry));
    if (isHighLtv) score += 10;

    const contentLower = websiteContent.toLowerCase();
    const revenueSurfaces = [
        contentLower.includes('services') || contentLower.includes('our services'),
        contentLower.includes('pricing') || contentLower.includes('rates') || contentLower.includes('quote'),
        contentLower.includes('book') || contentLower.includes('schedule') || contentLower.includes('appointment'),
        contentLower.includes('team') || contentLower.includes('staff') || contentLower.includes('meet our'),
        contentLower.includes('location') || contentLower.includes('locations') || contentLower.includes('branches'),
        contentLower.includes('hiring') || contentLower.includes('careers') || contentLower.includes('join our team'),
        contentLower.includes('since') || contentLower.includes('established') || contentLower.includes('years of experience'),
    ];
    score += Math.min(revenueSurfaces.filter(Boolean).length * 2, 10);

    if (reviewCount >= 100 && rating >= 4.0) score += 10;
    else if (reviewCount >= 50 && rating >= 3.8) score += 8;
    else if (reviewCount >= 20 && rating >= 3.5) score += 6;
    else if (reviewCount >= 10 && rating >= 3.0) score += 4;
    else if (reviewCount >= 5) score += 2;

    return Math.min(score, 30);
}

function scorePainOpportunity(
    websiteStatus: string,
    assessment: WebsiteAssessment | null,
    painSignals: PainSignal[],
    reviewCount: number,
): number {
    let score = 0;

    if (websiteStatus === 'MISSING') {
        score += reviewCount >= 3 ? 20 : 12;
    }

    if (assessment && websiteStatus === 'ACTIVE') {
        score += Math.min(assessment.speedRisk * 3, 15);
        score += Math.min(assessment.conversionRisk * 3, 15);
        score += Math.min(assessment.trustRisk * 2, 10);
    }

    if (painSignals.filter((signal) => signal.severity >= 3).length === 0 && websiteStatus === 'ACTIVE') {
        score = Math.min(score, 10);
    }

    return Math.min(score, 40);
}

function scoreReachability(
    contact: ContactValidation,
    hasContactForm: boolean,
    hasSocialMessaging: boolean,
): number {
    let score = 0;
    score += Math.round(contact.phoneConfidence * 8);

    if (contact.emailType === 'owner') score += Math.round(contact.emailConfidence * 8);
    else if (contact.emailType === 'staff') score += Math.round(contact.emailConfidence * 6);
    else if (contact.emailType === 'generic') score += Math.round(contact.emailConfidence * 4);
    else score += Math.round(contact.emailConfidence * 2);

    if (hasContactForm) score += 2;
    if (hasSocialMessaging) score += 2;
    return Math.min(score, 20);
}

function scoreLocalFit(city: string, reviewContent: string): number {
    let score = 0;
    const cityLower = city.toLowerCase().trim();

    if (AXIOM_CORE_CITIES.includes(cityLower)) score += 6;
    else if (AXIOM_PRIORITY_CITIES.includes(cityLower)) score += 4;
    else if (cityLower.includes('ontario') || cityLower.includes(', on')) score += 2;

    const contentLower = reviewContent.toLowerCase();
    const intentSignals = [
        contentLower.includes('new location') || contentLower.includes('just opened') || contentLower.includes('grand opening'),
        contentLower.includes('hiring') || contentLower.includes('looking for'),
        contentLower.includes('renovated') || contentLower.includes('new management') || contentLower.includes('under new'),
        contentLower.includes('expanding') || contentLower.includes('second location'),
    ];
    score += Math.min(intentSignals.filter(Boolean).length * 2, 4);

    return Math.min(score, 10);
}

function computeTier(axiomScore: number, painSignals: PainSignal[]): string {
    const painCount = painSignals.filter((signal) => signal.severity >= 2).length;
    if (axiomScore >= 80 && painCount >= 1) return 'S';
    if (axiomScore >= 80) return 'A';
    if (axiomScore >= 60) return 'A';
    if (axiomScore >= 40) return 'B';
    if (axiomScore >= 20) return 'C';
    return 'D';
}

export function computeAxiomScore(input: {
    niche: string;
    category: string;
    city: string;
    rating: number;
    reviewCount: number;
    websiteStatus: string;
    websiteContent: string;
    assessment: WebsiteAssessment | null;
    painSignals: PainSignal[];
    contact: ContactValidation;
    hasContactForm: boolean;
    hasSocialMessaging: boolean;
    reviewContent: string;
}): AxiomScoreResult {
    const businessValue = scoreBusinessValue(input.niche, input.category, input.rating, input.reviewCount, input.websiteContent);
    const painOpportunity = scorePainOpportunity(input.websiteStatus, input.assessment, input.painSignals, input.reviewCount);
    const reachability = scoreReachability(input.contact, input.hasContactForm, input.hasSocialMessaging);
    const localFit = scoreLocalFit(input.city, input.reviewContent);
    const axiomScore = Math.min(businessValue + painOpportunity + reachability + localFit, 100);

    return {
        axiomScore,
        tier: computeTier(axiomScore, input.painSignals),
        breakdown: { businessValue, painOpportunity, reachability, localFit },
        painSignals: input.painSignals,
    };
}

export function computeAxiomScoreFromDbLead(lead: {
    niche: string;
    category: string | null;
    city: string;
    rating: number | null;
    reviewCount: number | null;
    websiteStatus: string | null;
    email: string | null;
    phone: string | null;
    socialLink: string | null;
    contactName: string | null;
    tacticalNote: string | null;
    contact: ContactValidation;
}): AxiomScoreResult {
    const painSignals: PainSignal[] = [];

    if (lead.websiteStatus === 'MISSING') {
        painSignals.push({
            type: 'NO_WEBSITE',
            severity: 4,
            evidence: 'No website found - business relies on Google listing and word-of-mouth only',
            source: 'maps_data',
        });
        if ((lead.reviewCount || 0) >= 5) {
            painSignals.push({
                type: 'CONVERSION',
                severity: 3,
                evidence: `Active business with ${lead.reviewCount} reviews but zero web presence - losing leads to competitors`,
                source: 'heuristic',
            });
        }
    }

    const note = (lead.tacticalNote || '').toLowerCase();
    if (note.includes('poor') || note.includes('outdated') || note.includes('broken')) {
        painSignals.push({
            type: 'DESIGN',
            severity: 3,
            evidence: (lead.tacticalNote || '').slice(0, 120),
            source: 'ai_analysis',
        });
    }
    if (note.includes('no call') || note.includes('no cta') || note.includes('no form') || note.includes('no booking')) {
        painSignals.push({
            type: 'CONVERSION',
            severity: 3,
            evidence: 'No clear conversion path detected on website',
            source: 'ai_analysis',
        });
    }

    return computeAxiomScore({
        niche: lead.niche,
        category: lead.category || '',
        city: lead.city,
        rating: lead.rating || 0,
        reviewCount: lead.reviewCount || 0,
        websiteStatus: lead.websiteStatus || 'MISSING',
        websiteContent: lead.tacticalNote || '',
        assessment: null,
        painSignals,
        contact: lead.contact,
        hasContactForm: false,
        hasSocialMessaging: Boolean(lead.socialLink && lead.socialLink.includes('facebook')),
        reviewContent: '',
    });
}

export function generateDedupeKey(
    businessName: string,
    city: string,
    phone?: string | null,
    website?: string | null,
    address?: string | null,
): { key: string; matchedBy: string } {
    const normPhone = normalizePhone(phone);
    if (normPhone) return { key: `phone:${normPhone}`, matchedBy: 'phone' };

    const domain = extractDomain(website);
    if (domain && !['facebook.com', 'instagram.com', 'linkedin.com', 'twitter.com', 'x.com', 'yelp.com', 'google.com', 'yellowpages.ca'].includes(domain)) {
        return { key: `domain:${domain}`, matchedBy: 'domain' };
    }

    const normAddr = normalizeAddress(address);
    if (normAddr && normAddr.length > 5) {
        return { key: `addr:${normAddr}|${city.toLowerCase().trim()}`, matchedBy: 'address' };
    }

    return {
        key: `name:${normalizeName(businessName)}|${city.toLowerCase().trim()}`,
        matchedBy: 'name_city',
    };
}

export function checkDisqualifiers(input: {
    businessName: string;
    niche: string;
    category: string;
    city: string;
    rating: number;
    reviewCount: number;
    websiteStatus: string;
    websiteContent: string;
    assessment: WebsiteAssessment | null;
    painSignals: PainSignal[];
    axiomScore: number;
    tier: string;
}): DisqualifyResult {
    const reasons: string[] = [];
    const lower = `${input.niche} ${input.category} ${input.businessName}`.toLowerCase();
    const contentLower = input.websiteContent.toLowerCase();

    if (input.reviewCount === 0 && input.websiteStatus === 'MISSING') {
        reasons.push('Business appears inactive - zero reviews and no web presence');
    }

    if (LOW_ROI_INDUSTRIES.some((industry) => lower.includes(industry))) {
        reasons.push(`Industry low ROI for Axiom at current price point (${input.niche})`);
    }

    const isFranchise = FRANCHISE_INDICATORS.some((indicator) => contentLower.includes(indicator));
    if (isFranchise && !contentLower.includes('locally owned') && !contentLower.includes('independently owned')) {
        reasons.push('Corporate franchise site - local decision-maker unclear');
    }

    if (input.assessment && input.websiteStatus === 'ACTIVE') {
        const totalRisk = input.assessment.speedRisk + input.assessment.conversionRisk + input.assessment.trustRisk + input.assessment.seoRisk;
        if (totalRisk <= 4 && input.assessment.overallGrade === 'A') {
            reasons.push('Website already modern/high-performing with strong funnel - no pain to solve');
        }
    }

    if (input.rating > 0 && input.rating < 2.0 && input.reviewCount >= 10) {
        reasons.push(`Very low rating (${input.rating}/5 from ${input.reviewCount} reviews) - business has fundamental service issues`);
    }

    if (input.tier === 'D') {
        reasons.push(`Axiom score too low (${input.axiomScore}/100 = Tier D) - not worth call time`);
    }

    return {
        disqualified: reasons.length > 0,
        reasons,
        primaryReason: reasons[0] || null,
    };
}

export function generatePersonalization(input: {
    businessName: string;
    niche: string;
    city: string;
    websiteStatus: string;
    painSignals: PainSignal[];
    assessment: WebsiteAssessment | null;
    contactName: string | null;
}): PersonalizationResult {
    const topPains = [...input.painSignals].sort((a, b) => b.severity - a.severity).slice(0, 3);
    const firstName = input.contactName ? input.contactName.split(' ')[0] : null;
    const greeting = firstName ? `Hi ${firstName}, ` : '';

    if (input.websiteStatus === 'MISSING') {
        const hasReviews = topPains.some((pain) => pain.evidence.includes('reviews') || pain.evidence.includes('review'));
        if (hasReviews) {
            return {
                callOpener: `${greeting}Noticed ${input.businessName} has solid reviews on Google but no website showing up - in ${input.niche.toLowerCase()}, that usually means a lot of leads are going to competitors who do.`,
                followUpQuestion: 'Are you mainly looking to get more calls from people searching online, or is it more about having a professional presence when someone Googles you?',
            };
        }

        return {
            callOpener: `${greeting}Came across ${input.businessName} on Google Maps - strong listing but no website. Most of your competitors in ${input.city} have one, so there is an opening to capture the leads they are missing.`,
            followUpQuestion: 'Have you been thinking about getting a site built, or has it just not been a priority yet?',
        };
    }

    if (topPains.length === 0) {
        return {
            callOpener: `${greeting}Took a look at ${input.businessName}'s website - there may be a few quick wins that could help you get more calls from it.`,
            followUpQuestion: 'Are you happy with the volume of leads coming through your site right now, or do you feel like it could be doing more?',
        };
    }

    const painPhrases = topPains.map((pain) => {
        switch (pain.type) {
            case 'SPEED':
                return 'loads slow on mobile';
            case 'CONVERSION':
                if (pain.evidence.toLowerCase().includes('no booking') || pain.evidence.toLowerCase().includes('no form')) {
                    return 'has no quick way for visitors to book or request a quote';
                }
                if (pain.evidence.toLowerCase().includes('no cta')) {
                    return 'has no clear call-to-action to drive inquiries';
                }
                return 'has a weak conversion path for turning visitors into calls';
            case 'TRUST':
                if (pain.evidence.toLowerCase().includes('ssl') || pain.evidence.toLowerCase().includes('https')) {
                    return 'shows security warnings';
                }
                if (pain.evidence.toLowerCase().includes('outdated')) {
                    return 'looks like it has not been updated in a while';
                }
                return 'has trust signals that could be stronger';
            case 'SEO':
                return 'is not showing up well in local search';
            case 'DESIGN':
                return 'could use a modern design refresh';
            default:
                return 'has room for improvement';
        }
    });

    const evidenceStr = [...new Set(painPhrases)].slice(0, 2).join(' and ');
    let followUpQuestion = 'What would make the biggest difference for your business right now - more calls, or a better first impression online?';

    switch (topPains[0]?.type) {
        case 'SPEED':
            followUpQuestion = 'Have you noticed if customers mention the site being slow, or are you more focused on getting new leads?';
            break;
        case 'CONVERSION':
            followUpQuestion = 'Are you mainly trying to increase booked jobs this season, or is it more about improving how people find you online?';
            break;
        case 'TRUST':
            followUpQuestion = 'Has anyone mentioned that your site looks outdated, or is growing your customer base the bigger priority?';
            break;
        case 'SEO':
            followUpQuestion = 'Are your competitors showing up above you when people search for your services locally?';
            break;
    }

    return {
        callOpener: `${greeting}Looked at ${input.businessName}'s site - it ${evidenceStr}. We usually fix those together so you actually see more calls coming in within the first month.`,
        followUpQuestion,
    };
}
