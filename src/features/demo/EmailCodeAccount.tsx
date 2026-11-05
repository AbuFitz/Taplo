"use client";
import * as React from "react";
import { TaploInput } from "@/components/taplo/taplo-input";
import { Button } from "@/components/ui/button";
import {
  requestSignInCode,
  verifySignInCode,
  session,
  type AccountResult,
} from "./account";

const failureText = (result: AccountResult) =>
  result.ok
    ? ""
    : result.reason === "rate-limited"
      ? "Please wait a moment before trying again."
      : result.reason === "expired-code"
        ? "That code has expired. Request a new code."
        : result.reason === "invalid-code"
          ? "Check the latest code in your email and try again."
          : "We couldn’t complete sign-in. Your draft is still here. Please try again.";

export function EmailCodeAccount({ onConnected }: { onConnected: () => void }) {
  const [email, setEmail] = React.useState("");
  const [code, setCode] = React.useState("");
  const [sent, setSent] = React.useState(false);
  const [pending, setPending] = React.useState(false);
  const [error, setError] = React.useState("");
  const [until, setUntil] = React.useState(0);
  const [remaining, setRemaining] = React.useState(0);
  const lock = React.useRef(false);
  const field = React.useRef<HTMLInputElement>(null);
  React.useEffect(() => {
    if (!until) return;
    const sync = () =>
      setRemaining(Math.max(0, Math.ceil((until - Date.now()) / 1000)));
    sync();
    const timer = setInterval(sync, 1000);
    return () => clearInterval(timer);
  }, [until]);
  React.useEffect(() => {
    if (sent) field.current?.focus();
  }, [sent]);
  async function send() {
    if (lock.current || remaining > 0) return;
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setError("Enter an email address like name@example.com.");
      return;
    }
    lock.current = true;
    setPending(true);
    setError("");
    try {
      const result = await requestSignInCode(email);
      if (result.ok) {
        setSent(true);
        setCode("");
        setUntil(Date.now() + 30000);
      } else setError(failureText(result));
    } finally {
      lock.current = false;
      setPending(false);
    }
  }
  async function submit(event: React.FormEvent) {
    event.preventDefault();
    if (!sent) return send();
    if (lock.current) return;
    if (!/^\d{6}$/.test(code)) {
      setError("Enter the six-digit code from your email.");
      field.current?.focus();
      return;
    }
    lock.current = true;
    setPending(true);
    setError("");
    try {
      const result = await verifySignInCode(email, code);
      if (result.ok && (await session()).signedIn) onConnected();
      else
        setError(
          result.ok
            ? "We couldn’t confirm your sign-in. Please try again."
            : failureText(result),
        );
    } finally {
      lock.current = false;
      setPending(false);
    }
  }
  return (
    <form
      className="sf-stack"
      data-testid="account-step"
      onSubmit={(e) => void submit(e)}
      noValidate
      aria-busy={pending}
    >
      <h2 className="setup-account-title">
        {sent ? "Check your email" : "Continue to Taplo"}
      </h2>
      {sent ? (
        <>
          <p className="sf-help" role="status">
            We sent a code to {email.trim().replace(/^(.).*(@.*)$/, "$1•••$2")}.
            Use the latest code. It expires in 10 minutes.
          </p>
          <TaploInput
            ref={field}
            label="Sign-in code"
            value={code}
            inputMode="numeric"
            autoComplete="one-time-code"
            pattern="[0-9]{6}"
            maxLength={6}
            onChange={(e) => {
              setCode(e.target.value.replace(/\D/g, "").slice(0, 6));
              setError("");
            }}
            aria-describedby={error ? "account-code-error" : undefined}
            aria-invalid={Boolean(error)}
          />
        </>
      ) : (
        <TaploInput
          label="Email"
          type="email"
          inputMode="email"
          autoComplete="email"
          maxLength={254}
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            setError("");
          }}
          disabled={pending}
        />
      )}
      {error ? (
        <p id="account-code-error" className="sf-error" role="alert">
          {error}
        </p>
      ) : null}
      <Button type="submit" size="lg" className="sf-primary" disabled={pending}>
        {pending
          ? "Please wait…"
          : sent
            ? "Verify and open Studio"
            : "Send sign-in code"}
      </Button>
      {sent ? (
        <div className="flex flex-wrap items-center justify-between gap-3">
          <button
            className="sf-link min-h-11"
            type="button"
            disabled={pending}
            onClick={() => {
              setSent(false);
              setCode("");
              setError("");
            }}
          >
            Change email
          </button>
          <button
            className="sf-link min-h-11"
            type="button"
            disabled={pending || remaining > 0}
            onClick={() => void send()}
          >
            {remaining > 0 ? `Resend in ${remaining}s` : "Resend code"}
          </button>
        </div>
      ) : null}
    </form>
  );
}
