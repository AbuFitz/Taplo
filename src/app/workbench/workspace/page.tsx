import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { devToolsEnabled } from "@/lib/env";
import { WorkspaceWorkbench } from "@/features/workbench/WorkspaceWorkbench";
export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Workspace workbench",
  robots: { index: false, follow: false },
};
export default function Page() {
  if (!devToolsEnabled()) notFound();
  return <WorkspaceWorkbench />;
}
