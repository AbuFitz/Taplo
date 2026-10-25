"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Dialog, NavigationMenu } from "radix-ui";
import {
  ArrowUpRight,
  CalendarDays,
  Car,
  ChevronDown,
  ImageIcon,
  LayoutGrid,
  Menu,
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
import { PRODUCT_GROUPS, INDUSTRY_FILTERS } from "./ia";
import "./site-navigation.css";

const ICONS: Record<string, typeof Palette> = {
  design: Palette,
  services: List,
  booking: CalendarDays,
  enquiries: MessageCircle,
  messages: MessagesSquare,
  team: Users,
  products: Package,
  vehicles: Car,
  "gallery-reviews": ImageIcon,
  sharing: QrCode,
};

/** Shared product taxonomy in desktop menus and a compact mobile header. */
export function SiteNav({ cta, ctaHref }: { cta: string; ctaHref: string }) {
  const path = usePathname() ?? "/";
  const [menu, setMenu] = React.useState("");
  const [mobileSection, setMobileSection] = React.useState("product");
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
              data-brand-action
              href={ctaHref}
              onClick={close}
              className="site-nav-primary"
            >
              {cta}
            </Link>
          </div>
          <Dialog.Trigger
            ref={featureTrigger}
            className="site-mobile-trigger"
            aria-label="Open menu"
          >
            <Menu size={22} strokeWidth={1.7} aria-hidden="true" />
          </Dialog.Trigger>
        </div>
      </header>
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
            <Link href="/" aria-label="Taplo home" onClick={close}>
              <TaploLogo tone="light" className="h-7" />
            </Link>
            <Dialog.Title className="sr-only">Taplo menu</Dialog.Title>
            <Dialog.Close aria-label="Close menu" className="site-menu-close">
              <X size={23} aria-hidden="true" />
            </Dialog.Close>
          </div>
          <Dialog.Description className="sr-only">
            Explore the product, browse designs, or start your page.
          </Dialog.Description>
          <nav className="site-mobile-categories" aria-label="Menu categories">
            <button
              type="button"
              aria-expanded={mobileSection === "product"}
              aria-controls="mobile-product-links"
              onClick={() => setMobileSection("product")}
            >
              Product
              <ChevronDown size={14} aria-hidden="true" />
            </button>
            <button
              type="button"
              aria-expanded={mobileSection === "designs"}
              aria-controls="mobile-design-links"
              onClick={() => setMobileSection("designs")}
            >
              Designs
              <ChevronDown size={14} aria-hidden="true" />
            </button>
            <Link href="/pricing" aria-current={at("/pricing")} onClick={close}>
              Pricing
            </Link>
          </nav>
          <div className="site-feature-sheet-body">
            <div id="mobile-product-links" hidden={mobileSection !== "product"}>
              <div className="site-sheet-shortcuts">
                <Link href="/product" onClick={close}>
                  The platform
                  <ArrowUpRight size={15} aria-hidden="true" />
                </Link>
              </div>
              <div className="site-mobile-groups">
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
            </div>
            <div id="mobile-design-links" hidden={mobileSection !== "designs"}>
              <Link
                href="/inspiration"
                onClick={close}
                className="site-menu-overview"
              >
                Explore all designs
                <ArrowUpRight size={16} aria-hidden="true" />
              </Link>
              <ul className="site-mobile-designs">
                {INDUSTRY_FILTERS.map((industry) => (
                  <li key={industry.id}>
                    <Link
                      href={`/inspiration?industry=${industry.id}`}
                      onClick={close}
                    >
                      {industry.label}
                      <ArrowUpRight size={14} aria-hidden="true" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="site-feature-sheet-footer">
            <Link href="/how-it-works" onClick={close}>
              How it works
              <ArrowUpRight size={15} aria-hidden="true" />
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
