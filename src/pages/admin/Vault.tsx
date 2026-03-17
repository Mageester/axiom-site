import { useEffect, useMemo, useState } from "react";
import { Database, Globe, Mail, Star } from "lucide-react";

import OmniRoot from "@omni/OmniRoot";
import VaultDataTable from "@omni/components/VaultDataTable";
import { Badge } from "@omni/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@omni/components/ui/card";
import { StatCard } from "@omni/components/ui/stat-card";

import { apiJson, errorMessage } from "../../lib/api";
import type { OmniscientLead } from "../../lib/omniscient";

export default function Vault() {
  const [leads, setLeads] = useState<OmniscientLead[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    apiJson<{ leads: OmniscientLead[] }>("/api/omniscient/leads?limit=1000&includeArchived=1", {
      credentials: "include",
      timeoutMs: 20000,
    })
      .then((data) => {
        if (!active) return;
        setLeads(data.leads || []);
      })
      .catch((err) => {
        if (!active) return;
        setError(errorMessage(err, "Failed to load vault leads."));
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  const summary = useMemo(() => {
    const totalLeads = leads.length;
    const missingWebsite = leads.filter((lead) => lead.websiteStatus === "MISSING").length;
    const withEmail = leads.filter((lead) => lead.email && lead.email.length > 0).length;
    const avgRating = totalLeads > 0
      ? parseFloat((leads.reduce((sum, lead) => sum + (lead.rating || 0), 0) / totalLeads).toFixed(1))
      : 0;

    return { avgRating, missingWebsite, totalLeads, withEmail };
  }, [leads]);

  return (
    <OmniRoot>
      <div className="mx-auto max-w-7xl space-y-6">
        <div className="animate-slide-up">
          <h1 className="text-4xl font-extrabold tracking-tight">
            <span className="gradient-text">The Vault</span>
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Your secured repository of AI-enriched, qualified business intelligence.
          </p>
        </div>

        {error ? <p className="text-sm text-red-400">{error}</p> : null}

        <div className="grid animate-slide-up grid-cols-2 gap-4 lg:grid-cols-4" style={{ animationDelay: "100ms" }}>
          <StatCard
            glowClass="glow-emerald"
            icon={<Database />}
            iconColor="text-emerald-400"
            label="Total Leads"
            subtitle="targets acquired"
            value={summary.totalLeads}
          />
          <StatCard
            glowClass="glow-red"
            icon={<Globe />}
            iconColor="text-red-400"
            label="No Website"
            subtitle="prime targets"
            value={summary.missingWebsite}
          />
          <StatCard
            glowClass="glow-cyan"
            icon={<Mail />}
            iconColor="text-cyan-400"
            label="With Email"
            subtitle="contactable leads"
            value={summary.withEmail}
          />
          <StatCard
            glowClass="glow-amber"
            icon={<Star />}
            iconColor="text-amber-400"
            label="Avg Rating"
            subtitle="stars average"
            value={summary.avgRating}
          />
        </div>

        <div className="animate-slide-up" style={{ animationDelay: "200ms" }}>
          <Card className="glass-strong overflow-hidden rounded-xl glow-emerald">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2 text-lg font-bold text-white">
                    <Database className="h-5 w-5 text-emerald-400" />
                    Lead Intelligence Database
                  </CardTitle>
                  <CardDescription className="mt-1 text-xs">
                    Filter, sort, and export your enriched targets.
                  </CardDescription>
                </div>
                <Badge
                  className="border-emerald-900 bg-emerald-950/30 px-3 py-1 font-mono text-emerald-400"
                  variant="outline"
                >
                  {loading ? "Loading..." : `${leads.length} Records`}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              {loading ? (
                <p className="py-8 text-sm text-muted-foreground">Loading vault intelligence...</p>
              ) : (
                <VaultDataTable initialLeads={JSON.parse(JSON.stringify(leads))} />
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </OmniRoot>
  );
}
