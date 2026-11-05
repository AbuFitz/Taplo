"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowRight, Check, Plus } from "lucide-react";
import { TaploInput } from "@/components/taplo/taplo-input";
import { Button } from "@/components/ui/button";
import { newId } from "../actions";
import { useDemo, storageHasFailed } from "../store";
import { setupJourney } from "../setup-journey";
import {
  addQuickOffer,
  quickOfferErrors,
  type QuickOffer,
} from "./quick-offer";
import "./first-offer.css";

export function FirstOfferSetup() {
  const { state, update } = useDemo();
  const [open, setOpen] = React.useState(false);
  const [input, setInput] = React.useState<QuickOffer>({
    kind: "service",
    name: "",
    priceMode: "fixed",
    price: "",
    minutes: "",
  });
  const [errors, setErrors] = React.useState<
    ReturnType<typeof quickOfferErrors>
  >({});
  const [saved, setSaved] = React.useState(false);
  const [failed, setFailed] = React.useState(false);
  const form = React.useRef<HTMLFormElement>(null);
  const recordId = React.useRef<string | null>(null);
  if (!state) return null;
  const journey = setupJourney(state.content.identity.industryKey);
  const hasOffer = [
    ...(state.content.services ?? []),
    ...(state.content.products ?? []),
  ].some((item) => !item.archived);
  if (hasOffer && !open && !saved && !failed) return null;
  // Creative portfolios and vehicle stock retain their richer, dedicated authoring paths.
  if (journey.kind === "photo" || journey.kind === "vehicle") return null;
  const destination = input.kind === "product" ? "products" : "services";
  const begin = () => {
    setInput((current) => ({
      ...current,
      kind: journey.kind === "product" ? "product" : "service",
    }));
    setOpen(true);
  };
  const change = (patch: Partial<QuickOffer>) => {
    setInput((current) => ({ ...current, ...patch }));
    setErrors({});
  };
  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    const invalid = quickOfferErrors(input);
    setErrors(invalid);
    if (Object.keys(invalid).length) {
      requestAnimationFrame(() =>
        form.current
          ?.querySelector<HTMLInputElement>('[aria-invalid="true"]')
          ?.focus(),
      );
      return;
    }
    recordId.current ??= newId(input.kind === "product" ? "prod" : "svc");
    update((current) => addQuickOffer(current, input, recordId.current!));
    if (storageHasFailed()) {
      setFailed(true);
      return;
    }
    setFailed(false);
    setSaved(true);
    setOpen(false);
  };

  return (
    <section
      className="ws-first-offer"
      aria-labelledby="first-offer-heading"
      data-testid="first-offer-setup"
    >
      <span className="ws-first-offer-kicker">
        {saved ? "One useful thing, ready" : "Your next step"}
      </span>
      <h2 id="first-offer-heading">
        {saved
          ? `${input.name.trim()} is on your draft`
          : "Start with one thing you offer."}
      </h2>
      <p>
        {saved
          ? "Review it on your page. You decide when to publish."
          : "Add a name and choose how to show the price. You can fill in the finer details afterwards."}
      </p>
      {saved ? (
        <div className="ws-first-offer-actions">
          <Link className="ws-action" href="/dashboard/page">
            Review your page
            <ArrowRight aria-hidden="true" />
          </Link>
          <Link href={`/dashboard/${destination}`}>Manage {destination}</Link>
          <span role="status">
            <Check aria-hidden="true" />
            Added to draft
          </span>
        </div>
      ) : !open ? (
        <button className="ws-action" type="button" onClick={begin}>
          <Plus aria-hidden="true" />
          {journey.kind === "product"
            ? "Add your first product"
            : journey.heading}
        </button>
      ) : (
        <form
          ref={form}
          className="ws-first-offer-form"
          onSubmit={submit}
          noValidate
        >
          <fieldset className="ws-first-offer-kind">
            <legend>What are you adding?</legend>
            {(["service", "product"] as const).map((kind) => (
              <label key={kind}>
                <input
                  type="radio"
                  name="quick-offer-kind"
                  value={kind}
                  checked={input.kind === kind}
                  onChange={() => change({ kind })}
                />
                {kind === "service" ? "Service" : "Product"}
              </label>
            ))}
          </fieldset>
          <TaploInput
            autoFocus
            label={
              input.kind === "product" ? "Product name" : `${journey.noun} name`
            }
            value={input.name}
            maxLength={120}
            onChange={(e) => change({ name: e.target.value })}
            error={errors.name}
          />
          <fieldset className="ws-first-offer-kind">
            <legend>Price</legend>
            {(
              [
                ["fixed", "Set price"],
                ["quote", "Ask me"],
                ["free", "Free"],
              ] as const
            ).map(([mode, label]) => (
              <label key={mode}>
                <input
                  type="radio"
                  name="quick-offer-price"
                  value={mode}
                  checked={input.priceMode === mode}
                  onChange={() => change({ priceMode: mode })}
                />
                {label}
              </label>
            ))}
          </fieldset>
          <div className="ws-first-offer-fields">
            {input.priceMode === "fixed" ? (
              <TaploInput
                label="Amount (£)"
                inputMode="decimal"
                value={input.price}
                maxLength={9}
                onChange={(e) => change({ price: e.target.value })}
                error={errors.price}
              />
            ) : null}
            {input.kind === "service" ? (
              <TaploInput
                label="Duration in minutes (optional)"
                inputMode="numeric"
                value={input.minutes}
                maxLength={4}
                onChange={(e) => change({ minutes: e.target.value })}
                error={errors.minutes}
              />
            ) : null}
          </div>
          <p className="ws-first-offer-hint">
            {input.kind === "product"
              ? "Customers can ask about this item. Add photos and more details in Products."
              : "Customers can enquire about this service. Configure times and booking rules in Bookings."}
          </p>
          {failed ? (
            <p role="alert">
              We couldn’t save your changes. Your details are still here. Try
              again before leaving.
            </p>
          ) : null}
          <div className="ws-first-offer-actions">
            <Button type="submit">
              {failed ? "Try saving again" : "Add to your page"}
              <ArrowRight aria-hidden="true" />
            </Button>
            <button type="button" onClick={() => setOpen(false)}>
              Keep for later
            </button>
          </div>
        </form>
      )}
    </section>
  );
}
