export type OmniscientLead = {
  id: number
  businessName: string
  niche: string
  city: string
  category: string | null
  address: string | null
  phone: string | null
  websiteUrl: string | null
  email: string | null
  socialLink: string | null
  rating: number | null
  reviewCount: number | null
  websiteStatus: string | null
  contactName: string | null
  tacticalNote: string | null
  leadScore: number | null
  websiteGrade: string | null
  axiomScore: number | null
  axiomTier: string | null
  scoreBreakdown: string | null
  painSignals: string | null
  callOpener: string | null
  followUpQuestion: string | null
  axiomWebsiteAssessment: string | null
  dedupeKey: string | null
  dedupeMatchedBy: string | null
  emailType: string | null
  emailConfidence: number | null
  phoneConfidence: number | null
  disqualifiers: string | null
  disqualifyReason: string | null
  source: string | null
  isArchived: boolean
  createdAt: string
  lastUpdated: string | null
}

export type OmniscientAnalytics = {
  total: number
  withEmail: number
  withPhone: number
  missingWebsite: number
  activeWebsite: number
  withSocial: number
  withContact: number
  avgRating: number
  avgScore: number
  emailRate: number
  scoreDistribution: { elite: number; high: number; medium: number; low: number }
  nicheBreakdown: { name: string; count: number }[]
  cityDistribution: { name: string; count: number }[]
  leadsOverTime: { date: string; count: number }[]
  gradeDistribution: { grade: string; count: number }[]
  topLeads: { id: number; businessName: string; niche: string; city: string; axiomScore: number | null; axiomTier?: string | null; websiteStatus: string | null; email: boolean }[]
  recentActivity: { id: number; businessName: string; niche: string; city: string; axiomScore: number | null; websiteStatus: string | null; email: boolean; createdAt: string }[]
  funnel: { raw: number; enriched: number; scored: number; contactable: number }
}

export type OmniscientStats = {
  total: number
  todayLeads: number
  todayEmails: number
  todayCallable: number
  todayTierSA: number
  todayDisqualified: number
}

export type OmniscientRuntimeStatus = {
  appBaseUrl: string
  authAllowedCount: number
  adminEmailCount: number
  browserRenderingConfigured: boolean
  databaseTarget: "cloudflare-d1" | "binding-missing"
  geminiConfigured: boolean
  rateLimitMaxExport: number
  rateLimitMaxScrape: number
  rateLimitWindowSeconds: number
  scrapeConcurrencyLimit: number
  scrapeTimeoutMs: number
}

export function buildQueryString(params: Record<string, string | number | boolean | null | undefined>) {
  const search = new URLSearchParams()
  Object.entries(params).forEach(([key, value]) => {
    if (value === null || value === undefined || value === "") return
    if (typeof value === "boolean") {
      search.set(key, value ? "1" : "0")
      return
    }
    search.set(key, String(value))
  })
  return search.toString()
}
