import { Suspense } from "react";
import BrowseServices from "./BrowseServices";
import { PageLoader } from "@/components/ui";

export const metadata = { title: "Browse Services" };

export default function ServicesPage() {
  return (
    <Suspense fallback={<PageLoader label="Loading services…" />}>
      <BrowseServices />
    </Suspense>
  );
}
