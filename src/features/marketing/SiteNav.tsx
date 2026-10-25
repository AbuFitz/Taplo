"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Dialog, NavigationMenu } from "radix-ui";
import {
  ArrowUpRight,
  CalendarDays,
  CarFront,
  ChevronDown,
  Compass,
  CreditCard,
  ImageIcon,
  LayoutGrid,
  List,
  MessageCircle,
  MessagesSquare,
  Package,
  Palette,
  QrCode,
  Users,
  X,
} from "lucide-react";
import { TaploLogo } from "@/components/taplo/brand";
import { dashboardDestination } from "@/lib/domains";
import { PRODUCT_GROUPS, INDUSTRY_FILTERS } from "./ia";
import "./site-navigation.css";

const subscribeHost = () => () => {};
const ICONS: Record<string, typeof Palette> = {
  design: Palette,
  services: List,
  booking: CalendarDays,
  enquiries: MessageCircle,
  messages: MessagesSquare,
  team: Users,
  products: Package,
  vehicles: CarFront,
  "gallery-reviews": ImageIcon,
  sharing: QrCode,
};

/** One information architecture; native desktop menus and a thumb-reachable mobile sheet. */
export function SiteNav({
  cta,
  ctaHref,
  loginHref,
}: {
  cta: string;
  ctaHref: string;
  loginHref: string;
}) {
  const path = usePathname() ?? "/";
  const host = React.useSyncExternalStore(
    subscribeHost,
    () => window.location.hostname,
    () => "",
  );
  const dashboardHref = dashboardDestination(host, loginHref);
  const [menu, setMenu] = React.useState("");
  const [openOn, setOpenOn] = React.useState<string | null>(null);
  const productTrigger = React.useRef<HTMLButtonElement>(null);
  const featureTrigger = React.useRef<HTMLButtonElement>(null);
  const close = () => {
    setOpenOn(null);
    setMenu("");
  };
  React.useEffect(() => {
    const desktop = window.matchMedia("(min-width: 768px)");
    const sync = () => {
      if (desktop.matches && openOn !== null) {
        setOpenOn(null);
        requestAnimationFrame(() => productTrigger.current?.focus());
      }
    };
    desktop.addEventListener("change", sync);
    return () => desktop.removeEventListener("change", sync);
  }, [openOn]);
  const at = (href: string) =>
    path === href || path.startsWith(href + "/")
      ? ("page" as const)
      : undefined;
  return (
    <Dialog.Root
      open={openOn === path}
      onOpenChange={(open) => {
        setOpenOn(open ? path : null);
        setMenu("");
      }}
    >
      <header aria-label="Taplo website" className="site-navigation">
        <div className="site-navigation-bar">
          <Link
            href="/"
            aria-label="Taplo home"
            className="site-navigation-brand"
            onClick={close}
          >
            <TaploLogo tone="light" className="h-7" />
          </Link>
          <NavigationMenu.Root
            value={menu}
            onValueChange={setMenu}
            aria-label="Primary"
            className="site-desktop-navigation"
            delayDuration={150}
          >
            <NavigationMenu.List className="site-navigation-links">
              <NavigationMenu.Item>
                <NavigationMenu.Trigger
                  ref={productTrigger}
                  className="site-nav-link"
                  aria-current={at("/product")}
                >
                  Product
                  <ChevronDown size={13} aria-hidden="true" />
                </NavigationMenu.Trigger>
                <NavigationMenu.Content className="site-mega-content">
                  <div className="site-mega-groups">
                    {PRODUCT_GROUPS.map((group) => (
                      <div key={group.title}>
                        <p className="site-menu-label">{group.title}</p>
                        <ul>
                          {group.links.map((link) => {
                            const Icon =
                              ICONS[link.href.split("/").at(-1)!] ?? LayoutGrid;
                            return (
                              <li key={link.href}>
                                <NavigationMenu.Link asChild>
                                  <Link
                                    href={link.href}
                                    onClick={close}
                                    className="site-feature-link"
                                  >
                                    <Icon
                                      size={19}
                                      strokeWidth={1.6}
                                      aria-hidden="true"
                                    />
                                    <span>
                                      {link.label}
                                      <small>{link.blurb}</small>
                                    </span>
                                  </Link>
                                </NavigationMenu.Link>
                              </li>
                            );
                          })}
                        </ul>
                      </div>
                    ))}
                  </div>
                  <NavigationMenu.Link asChild>
                    <Link
                      href="/product"
                      onClick={close}
                      className="site-menu-overview"
                    >
                      Explore the platform
                      <ArrowUpRight size={16} aria-hidden="true" />
                    </Link>
                  </NavigationMenu.Link>
                </NavigationMenu.Content>
              </NavigationMenu.Item>
              <NavigationMenu.Item>
                <NavigationMenu.Trigger
                  className="site-nav-link"
                  aria-current={at("/inspiration")}
                >
                  Designs
                  <ChevronDown size={13} aria-hidden="true" />
                </NavigationMenu.Trigger>
                <NavigationMenu.Content className="site-mega-content">
                  <div className="site-design-menu">
                    <div>
                      <p className="site-menu-heading">
                        Find your starting point.
                      </p>
                      <NavigationMenu.Link asChild>
                        <Link
                          href="/inspiration"
                          onClick={close}
                          className="site-menu-overview"
                        >
                          Explore all designs
                          <ArrowUpRight size={16} aria-hidden="true" />
                        </Link>
                      </NavigationMenu.Link>
                    </div>
                    <ul>
                      {INDUSTRY_FILTERS.map((industry) => (
                        <li key={industry.id}>
                          <NavigationMenu.Link asChild>
                            <Link
                              href={`/inspiration?industry=${industry.id}`}
                              onClick={close}
                              className="site-nav-link"
                            >
                              {industry.label}
                            </Link>
                          </NavigationMenu.Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                </NavigationMenu.Content>
              </NavigationMenu.Item>
              <NavigationMenu.Item>
                <NavigationMenu.Link asChild>
                  <Link
                    href="/how-it-works"
                    onClick={close}
                    className="site-nav-link"
                    aria-current={at("/how-it-works")}
                  >
                    How it works
                  </Link>
                </NavigationMenu.Link>
              </NavigationMenu.Item>
              <NavigationMenu.Item>
                <NavigationMenu.Link asChild>
                  <Link
                    href="/pricing"
                    onClick={close}
                    className="site-nav-link"
                    aria-current={at("/pricing")}
                  >
                    Pricing
                  </Link>
                </NavigationMenu.Link>
              </NavigationMenu.Item>
            </NavigationMenu.List>
            <div className="site-menu-viewport">
              <NavigationMenu.Viewport className="site-mega-viewport" />
            </div>
          </NavigationMenu.Root>
          <div className="site-nav-actions">
            <Link
              href={dashboardHref}
              className="site-studio-link"
              onClick={close}
            >
              Open Studio
              <ArrowUpRight size={13} aria-hidden="true" />
            </Link>
            <Link
              data-brand-action
              href={ctaHref}
              onClick={close}
              className="site-nav-primary site-desktop-start"
            >
              {cta}
            </Link>
          </div>
        </div>
      </header>
      <nav aria-label="Mobile navigation" className="site-thumb-dock">
        <Dialog.Trigger
          ref={featureTrigger}
          className="site-thumb-item"
          aria-label="Explore features"
        >
          <LayoutGrid size={19} strokeWidth={1.7} aria-hidden="true" />
          <span>Features</span>
        </Dialog.Trigger>
        <Link
          href="/inspiration"
          className="site-thumb-item"
          aria-current={at("/inspiration")}
          onClick={close}
        >
          <Compass size={19} strokeWidth={1.7} aria-hidden="true" />
          <span>Designs</span>
        </Link>
        <Link
          href="/pricing"
          className="site-thumb-item"
          aria-current={at("/pricing")}
          onClick={close}
        >
          <CreditCard size={19} strokeWidth={1.7} aria-hidden="true" />
          <span>Pricing</span>
        </Link>
        <Link
          data-brand-action
          href={ctaHref}
          onClick={close}
          className="site-nav-primary"
        >
          {cta}
        </Link>
      </nav>
      <Dialog.Portal>
        <Dialog.Overlay className="site-feature-overlay" />
        <Dialog.Content
          className="site-feature-sheet"
          onCloseAutoFocus={(e) => {
            e.preventDefault();
            (window.matchMedia("(min-width:768px)").matches
              ? productTrigger.current
              : featureTrigger.current
            )?.focus();
          }}
        >
          <div className="site-feature-sheet-header">
            <Dialog.Title>Explore Taplo</Dialog.Title>
            <Dialog.Close
              aria-label="Close features"
              className="site-menu-close"
            >
              <X size={21} aria-hidden="true" />
            </Dialog.Close>
          </div>
          <Dialog.Description className="sr-only">
            Features, designs and setup. Choose a page to explore.
          </Dialog.Description>
          <div className="site-feature-sheet-body">
            <div className="site-sheet-shortcuts">
              <Link href="/product" onClick={close}>
                The platform
                <ArrowUpRight size={15} aria-hidden="true" />
              </Link>
              <Link href="/how-it-works" onClick={close}>
                How it works
                <ArrowUpRight size={15} aria-hidden="true" />
              </Link>
            </div>
            {PRODUCT_GROUPS.map((group) => (
              <section key={group.title}>
                <h3 className="site-menu-label">{group.title}</h3>
                <ul>
                  {group.links.map((link) => {
                    const Icon =
                      ICONS[link.href.split("/").at(-1)!] ?? LayoutGrid;
                    return (
                      <li key={link.href}>
                        <Link
                          href={link.href}
                          onClick={close}
                          className="site-feature-link"
                        >
                          <Icon
                            size={21}
                            strokeWidth={1.6}
                            aria-hidden="true"
                          />
                          <span>
                            {link.label}
                            <small>{link.blurb}</small>
                          </span>
                          <ArrowUpRight
                            className="site-feature-arrow"
                            size={15}
                            aria-hidden="true"
                          />
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </section>
            ))}
          </div>
          <div className="site-feature-sheet-footer">
            <Link href={dashboardHref} onClick={close}>
              Open Studio
            </Link>
            <Link
              data-brand-action
              href={ctaHref}
              onClick={close}
              className="site-nav-primary"
            >
              {cta}
            </Link>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
