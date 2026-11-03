import { z } from "zod";
export const REPORT_REASONS = {
  bug: [
    "Something does not work",
    "Layout or accessibility problem",
    "Lost or incorrect information",
    "Something else",
  ],
  page: [
    "Scam or impersonation",
    "Harmful or prohibited content",
    "Privacy or intellectual property",
    "Incorrect business information",
    "Something else",
  ],
} as const;
export type ReportKind = keyof typeof REPORT_REASONS;
export const reportSchema = z
  .object({
    version: z.literal(1),
    kind: z.enum(["bug", "page"]),
    reason: z.string().min(1, "Choose the issue you want to report.").max(100),
    description: z
      .string()
      .trim()
      .min(15, "Please describe what happened in at least 15 characters.")
      .max(3000),
    expected: z.string().trim().max(1500).optional(),
    contact: z
      .string()
      .trim()
      .email("Use a valid email address.")
      .max(254)
      .optional()
      .or(z.literal("")),
    path: z.string().max(500),
    businessName: z.string().max(120).optional(),
    createdAt: z.string().datetime(),
    diagnostics: z
      .object({
        viewport: z.string().max(40),
        displayMode: z.enum(["browser", "standalone"]),
        plan: z.string().max(30).optional(),
      })
      .optional(),
  })
  .superRefine((r, ctx) => {
    if (!(REPORT_REASONS[r.kind] as readonly string[]).includes(r.reason))
      ctx.addIssue({
        code: "custom",
        path: ["reason"],
        message: "Choose a report reason.",
      });
  });
export type Report = z.infer<typeof reportSchema>;
/** Never include query strings, fragments, account data, bookings, screenshots or storage dumps. */
export function reportPath(href: string) {
  try {
    return new URL(href, "https://mytaplo.com").pathname.slice(0, 500);
  } catch {
    return "/";
  }
}
export function reportText(report: Report) {
  return [
    `Taplo ${report.kind === "bug" ? "problem report" : "business page report"}`,
    `Reason: ${report.reason}`,
    `Page: ${report.path}`,
    report.businessName ? `Business: ${report.businessName}` : "",
    `Created: ${report.createdAt}`,
    "",
    report.description,
    report.expected ? `\nExpected: ${report.expected}` : "",
    report.contact ? `\nReply to: ${report.contact}` : "",
    report.diagnostics
      ? `\nOptional details: ${JSON.stringify(report.diagnostics)}`
      : "",
  ]
    .filter(Boolean)
    .join("\n");
}
/** Adapter contract: no provider means a draft, never a fabricated ticket. Only same-origin endpoints may receive reports. */
export async function deliverReport(report: Report) {
  const endpoint = process.env.NEXT_PUBLIC_REPORT_ENDPOINT;
  if (!endpoint) return { state: "unconnected" as const };
  if (!/^\/[a-zA-Z0-9/_-]+$/.test(endpoint) || endpoint.startsWith("//"))
    throw new Error(
      "Reporting is not configured correctly. Save your report instead.",
    );
  const response = await fetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(report),
  });
  if (!response.ok)
    throw new Error("Your report could not be sent. Your draft is still here.");
  const result = (await response.json()) as { reference?: unknown };
  if (
    typeof result.reference !== "string" ||
    !result.reference.trim() ||
    result.reference.length > 120
  )
    throw new Error("Delivery was not confirmed. Keep a copy of your report.");
  return { state: "sent" as const, reference: result.reference };
}
