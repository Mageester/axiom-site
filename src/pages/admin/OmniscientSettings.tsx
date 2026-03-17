import { useEffect, useState } from "react";

import OmniRoot from "@omni/OmniRoot";
import { SettingsClient } from "@omni/pages/SettingsClient";

import { apiJson, errorMessage } from "../../lib/api";
import type { OmniscientRuntimeStatus } from "../../lib/omniscient";

export default function OmniscientSettings() {
  const [runtimeStatus, setRuntimeStatus] = useState<OmniscientRuntimeStatus | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    apiJson<OmniscientRuntimeStatus>("/api/omniscient/runtime", {
      credentials: "include",
      timeoutMs: 15000,
    })
      .then((data) => {
        if (active) setRuntimeStatus(data);
      })
      .catch((err) => {
        if (active) setError(errorMessage(err, "Failed to load runtime status."));
      });

    return () => {
      active = false;
    };
  }, []);

  return (
    <OmniRoot>
      {error ? <p className="text-sm text-red-400">{error}</p> : null}
      {runtimeStatus ? <SettingsClient runtimeStatus={runtimeStatus as any} /> : <p className="text-sm text-muted-foreground">Loading runtime status...</p>}
    </OmniRoot>
  );
}
