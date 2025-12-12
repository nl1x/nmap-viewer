import { CircularProgress } from "@heroui/progress";

import HostAccordion from "@/components/layout/host-accordion.tsx";
import UploadScans from "@/components/layout/upload-scans.tsx";
import useHostsContext from "@/hooks/hosts/hosts-provider.tsx";

export default function IndexPage() {
  const { hosts, loading, error } = useHostsContext();

  return (
    <section className="flex flex-col items-center justify-center gap-4 py-8 p-50 md:py-10">
      {(loading && <CircularProgress aria-label="Loading..." />) ||
        (error !== null && <p>{error}</p>) || (
          <div className="w-2/4 pt-10">
            <UploadScans className="mb-15" />
            <HostAccordion hosts={hosts} />
          </div>
        )}
    </section>
  );
}
