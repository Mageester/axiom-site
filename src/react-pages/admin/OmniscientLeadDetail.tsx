import { useParams } from "react-router-dom";

import OmniRoot from "@omni/OmniRoot";
import { DossierClient } from "@omni/pages/DossierClient";
import { ToastProvider } from "@omni/components/ui/toast-provider";

export default function OmniscientLeadDetail() {
  const { id } = useParams<{ id: string }>();
  const leadId = Number(id);

  if (!Number.isFinite(leadId)) {
    return null;
  }

  return (
    <OmniRoot>
      <ToastProvider>
        <DossierClient leadId={leadId} />
      </ToastProvider>
    </OmniRoot>
  );
}
