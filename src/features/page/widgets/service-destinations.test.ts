import { expect, it } from "vitest";
import { buildPageViewModel } from "../renderer/view-model";
import {
  initialConfig,
  toContent,
  toPage,
} from "@/features/showcase/lab-state";
import { buildContext } from "@/features/booking/model";
import { serviceErrors } from "@/features/demo/ServiceForm";
import { serviceSchema } from "@/features/businesses/content";

it("an external service is a ready booking-block destination even without contact channels or Taplo availability", () => {
  const config = initialConfig("fixnow"),
    content = toContent(config),
    page = toPage(config);
  content.contacts = { social: [] };
  page.appearance.header = { ...page.appearance.header, actions: "primary" };
  page.widgets = [
    {
      id: "destination",
      type: "booking",
      version: 1,
      hidden: false,
      appearance: {},
      settings: { serviceId: content.services[2].id },
    },
  ];
  const vm = buildPageViewModel(content, page, { plan: "business" });
  expect(vm.widgets[0].status).toEqual({ state: "ready" });
  expect(vm.primary).toMatchObject({
    label: "Get a quote",
    href: "https://www.fixnowmechanics.co.uk/estimate",
  });
  expect(vm.promotedWidgetId).toBe("destination");
  expect(vm.onlineBooking).toBe(false);
});
it("a removed or plan-limited selected service never turns into a different service", () => {
  const config = initialConfig("fixnow"),
    content = toContent(config),
    page = toPage(config);
  page.widgets = [
    {
      id: "destination",
      type: "booking",
      version: 1,
      hidden: false,
      appearance: {},
      settings: { serviceId: content.services[5].id },
    },
  ];
  const free = buildPageViewModel(content, page, { plan: "free" });
  expect(free.widgets[0].status.state).toBe("empty");
  expect(free.visible).toEqual([]);
  const removed = buildPageViewModel(
    { ...content, services: content.services.slice(0, 5) },
    page,
    { plan: "business" },
  );
  expect(removed.widgets[0].status.state).toBe("empty");
  expect(removed.promotedWidgetId).toBeNull();
});
it("package inclusions stay ordered through validation and the booking model, while blank or oversized lists cannot be saved", () => {
  const content = toContent(initialConfig("fixnow"));
  const inclusions = [
    "Exterior wash",
    "Windows inside and out",
    "Interior vacuum",
  ];
  content.services[0] = { ...content.services[0], inclusions };
  expect(buildContext(content).services[0].inclusions).toEqual(inclusions);
  expect(serviceSchema.parse(content.services[0]).inclusions).toEqual(
    inclusions,
  );
  expect(
    serviceErrors({ ...content.services[0], inclusions: [""] }),
  ).toHaveProperty("inclusions");
  expect(
    serviceErrors({
      ...content.services[0],
      inclusions: Array(9).fill("Included"),
    }),
  ).toHaveProperty("inclusions");
  expect(serviceErrors(content.services[0])).toEqual({});
});

it("selected service action text follows its actual mode and plan", async () => {
  const { serviceActionLabel } = await import("@/features/booking/model");
  const service = toContent(initialConfig("fixnow")).services[0];
  expect(serviceActionLabel(service, false, "Book")).toBe("Get a quote");
  const local = {
    ...service,
    externalUrl: undefined,
    externalLabel: undefined,
    bookingMode: "instant" as const,
    durationMinutes: 30,
  };
  expect(serviceActionLabel(local, true, "Book")).toBe("Book a time");
  expect(
    serviceActionLabel({ ...local, bookingMode: "request" }, true, "Book"),
  ).toBe("Request a time");
  expect(serviceActionLabel(local, false, "Book")).toBe("Ask about this");
});
