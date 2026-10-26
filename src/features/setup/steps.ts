import type { OnboardingStep } from "@/features/demo/store"

/**
 * One definition of the setup journey. Each step says what it asks, how it is split on a phone, and where the
 * live preview should look while it is being filled in, so the handset follows the work rather than sitting still.
 */
export type StageView = "close" | "whole"
export interface StepDef {
  id: Exclude<OnboardingStep, "goal">
  label: string
  title: string
  /** Extra screens on a phone, each with its own heading. The first is the step's own title. */
  parts?: { title: string; focus?: string; view?: StageView }[]
  view: StageView
  focus: string
  /** How much of a phone's height the preview takes while this step is open. */
  stage: "large" | "medium" | "small" | "hidden"
}

export const STEPS: StepDef[] = [
  { id: "business", label: "Basics", title: "Start with the basics.", view: "close", focus: "header", stage: "large",
    parts: [{ title: "Start with the basics.", focus: "header" }, { title: "Shape your profile.", focus: "header" }] },
  { id: "industry", label: "Business", title: "What do you do?", view: "close", focus: "header", stage: "small" },
  { id: "reach", label: "Contact", title: "What should customers do first?", view: "close", focus: "actions", stage: "medium",
    parts: [{ title: "What should customers do first?", focus: "header" }, { title: "How can they reach you?", focus: "actions" }] },
  { id: "contacts", label: "Offer", title: "What do you offer?", view: "close", focus: "offer", stage: "medium",
    parts: [{ title: "What do you offer?", focus: "offer" }, { title: "Where and when?", focus: "offer" }] },
  { id: "widgets", label: "Look", title: "Choose your look.", view: "whole", focus: "top", stage: "large" },
  { id: "plan", label: "Plan", title: "Pick your plan.", view: "close", focus: "booking", stage: "medium" },
  { id: "publish", label: "Ready", title: "Your page is ready.", view: "whole", focus: "top", stage: "large" },
]
export const stepIndexOf = (id: OnboardingStep) => Math.max(0, STEPS.findIndex((s) => s.id === (id === "goal" ? "reach" : id)))
