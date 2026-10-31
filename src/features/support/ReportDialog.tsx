"use client";
import * as React from "react";
import { Bug, Flag, Check, Copy, Download } from "lucide-react";
import { Overlay } from "@/components/taplo/overlay";
import {
  REPORT_REASONS,
  reportSchema,
  reportPath,
  reportText,
  deliverReport,
  type ReportKind,
} from "./report";
import "./support.css";
export function ReportDialog({
  kind = "bug",
  businessName,
  plan,
  trigger,
}: {
  kind?: ReportKind;
  businessName?: string;
  plan?: string;
  trigger?: React.ReactNode;
}) {
  const [open, setOpen] = React.useState(false),
    [reason, setReason] = React.useState(""),
    [description, setDescription] = React.useState(""),
    [expected, setExpected] = React.useState(""),
    [contact, setContact] = React.useState(""),
    [diagnostics, setDiagnostics] = React.useState(false),
    [error, setError] = React.useState(""),
    [message, setMessage] = React.useState(""),
    [busy, setBusy] = React.useState(false),
    [reference, setReference] = React.useState("");
  const Icon = kind === "bug" ? Bug : Flag;
  const build = () =>
    reportSchema.safeParse({
      version: 1,
      kind,
      reason,
      description,
      expected,
      contact,
      path: reportPath(window.location.href),
      businessName,
      createdAt: new Date().toISOString(),
      ...(diagnostics
        ? {
            diagnostics: {
              viewport: `${window.innerWidth} × ${window.innerHeight}`,
              displayMode: matchMedia("(display-mode: standalone)").matches
                ? "standalone"
                : "browser",
              plan,
            },
          }
        : {}),
    });
  const validReport = () => {
    const r = build();
    if (!r.success) {
      setError(r.error.issues[0]?.message ?? "Check your report.");
      return null;
    }
    setError("");
    return r.data;
  };
  const copy = async () => {
    const r = validReport();
    if (!r) return;
    try {
      await navigator.clipboard.writeText(reportText(r));
      setMessage("Report copied. It has not been sent.");
    } catch {
      setError("Copy is unavailable. Download your report instead.");
    }
  };
  const download = () => {
    const r = validReport();
    if (!r) return;
    const url = URL.createObjectURL(
      new Blob([reportText(r)], { type: "text/plain;charset=utf-8" }),
    );
    const a = document.createElement("a");
    a.href = url;
    a.download = `taplo-${kind}-report-${new Date().toISOString().slice(0, 10)}.txt`;
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    setMessage("Report downloaded. It has not been sent.");
  };
  const send = async () => {
    const r = validReport();
    if (!r) return;
    setBusy(true);
    try {
      const result = await deliverReport(r);
      if (result.state === "sent") {
        setReference(result.reference);
        setMessage("Report received.");
      } else
        setMessage("Delivery is not connected. Download or copy your report.");
    } catch (e) {
      setError(
        e instanceof Error
          ? e.message
          : "Your draft is still here. Please try again.",
      );
    } finally {
      setBusy(false);
    }
  };
  return (
    <>
      <button
        type="button"
        className="support-trigger"
        onClick={() => setOpen(true)}
      >
        {trigger ?? (
          <>
            <Icon />
            {kind === "bug" ? "Report a problem" : "Report this page"}
          </>
        )}
      </button>
      <Overlay
        open={open}
        onOpenChange={setOpen}
        kind="detail"
        title={
          kind === "bug" ? "Report a problem" : "Report this business page"
        }
        description={
          kind === "bug"
            ? "Tell us what got in your way. Your page content is not attached."
            : "Help keep Taplo trustworthy. This report concerns the page, not a booking dispute."
        }
        className="report-dialog"
        footer={
          !reference ? (
            <div className="report-actions">
              <button type="button" onClick={copy}>
                <Copy />
                Copy report
              </button>
              <button type="button" onClick={download}>
                <Download />
                Download
              </button>
              {process.env.NEXT_PUBLIC_REPORT_ENDPOINT ? (
                <button type="button" disabled={busy} onClick={send}>
                  {busy ? "Sending…" : "Send report"}
                </button>
              ) : null}
            </div>
          ) : (
            <button
              className="report-done"
              type="button"
              onClick={() => setOpen(false)}
            >
              Done
            </button>
          )
        }
      >
        {reference ? (
          <div className="report-received">
            <Check />
            <h3>Thank you for reporting it.</h3>
            <p>Your reference is {reference}.</p>
          </div>
        ) : (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              void send();
            }}
          >
            <div className="report-context">
              <Icon />
              <span>
                {businessName || "Taplo"}
                <small>
                  {kind === "bug"
                    ? "A platform problem"
                    : "A business page report"}
                </small>
              </span>
            </div>
            <fieldset>
              <legend>What is the issue?</legend>
              <div className="report-reasons">
                {REPORT_REASONS[kind].map((v) => (
                  <label key={v} data-selected={reason === v}>
                    <input
                      type="radio"
                      name={`report-${kind}-reason`}
                      value={v}
                      checked={reason === v}
                      onChange={() => setReason(v)}
                    />
                    <span>{v}</span>
                    {reason === v ? <Check /> : null}
                  </label>
                ))}
              </div>
            </fieldset>
            <label className="report-field">
              {kind === "bug" ? "What happened?" : "What should we look at?"}
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                maxLength={3000}
                rows={4}
                placeholder={
                  kind === "bug"
                    ? "What were you trying to do? What happened instead?"
                    : "Describe the issue and the specific content involved."
                }
                aria-describedby="report-privacy"
              />
            </label>
            {kind === "bug" ? (
              <label className="report-field">
                What did you expect? <span>Optional</span>
                <textarea
                  value={expected}
                  onChange={(e) => setExpected(e.target.value)}
                  maxLength={1500}
                  rows={2}
                />
              </label>
            ) : null}
            <label className="report-field">
              Email for a reply <span>Optional</span>
              <input
                type="email"
                autoComplete="email"
                value={contact}
                onChange={(e) => setContact(e.target.value)}
                maxLength={254}
              />
            </label>
            {kind === "bug" ? (
              <label className="report-consent">
                <input
                  type="checkbox"
                  checked={diagnostics}
                  onChange={(e) => setDiagnostics(e.target.checked)}
                />
                <span>
                  Include screen size, browser/app mode and plan.
                  <small>
                    No account, customer or booking data is attached.
                  </small>
                </span>
              </label>
            ) : null}
            <p id="report-privacy" className="report-privacy">
              Do not include passwords, payment details or private customer
              information.
            </p>
            {!process.env.NEXT_PUBLIC_REPORT_ENDPOINT ? (
              <div className="report-delivery">
                <b>Save your report</b>
                <p>
                  Report delivery is not connected in this environment. Copy or
                  download the details; nothing is sent or stored by Taplo.
                </p>
              </div>
            ) : null}
          </form>
        )}
        {error ? (
          <p className="report-error" role="alert">
            {error}
          </p>
        ) : null}
        {message ? (
          <p className="report-message" role="status">
            {message}
          </p>
        ) : null}
      </Overlay>
    </>
  );
}
