"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { NavigationMenu } from "radix-ui";
import {
  ArrowUpRight,
  CalendarDays,
  Car as CarSide,
  ChevronDown,
  ImageIcon,
  LayoutGrid,
  List,
  MessageCircle,
  MessagesSquare,
  Package,
  Palette,
  QrCode,
  Users,
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
  vehicles: CarSide,
  "gallery-reviews": ImageIcon,
  sharing: QrCode,
};

const mobileQuery = "(max-width: 767px)";
const subscribeViewport = (notify: () => void) => {
  const query = window.matchMedia(mobileQuery);
  query.addEventListener("change", notify);
  return () => query.removeEventListener("change", notify);
};
const mobileSnapshot = () => window.matchMedia(mobileQuery).matches;
const serverSnapshot = () => false;

/** Shared product taxonomy in desktop menus and a compact mobile header. */
export function SiteNav({ cta, ctaHref }: { cta: string; ctaHref: string }) {
  const path = usePathname() ?? "/";
  const [menu, setMenu] = React.useState("");
  const mobile = React.useSyncExternalStore(
    subscribeViewport,
    mobileSnapshot,
    serverSnapshot,
  );
  const header = React.useRef<HTMLElement>(null);
  const productTrigger = React.useRef<HTMLButtonElement>(null);
  React.useEffect(() => {
    const query = window.matchMedia(mobileQuery);
    const dismissOnResize = () => {
      if (!menu) return;
      setMenu("");
      requestAnimationFrame(() => productTrigger.current?.focus());
    };
    query.addEventListener("change", dismissOnResize);
    return () => query.removeEventListener("change", dismissOnResize);
  }, [menu]);
  React.useEffect(() => {
    if (!menu) return;
    const escape = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      header.current
        ?.querySelector<HTMLButtonElement>('button[data-state="open"]')
        ?.focus();
      setMenu("");
    };
    window.addEventListener("keydown", escape, true);
    return () => window.removeEventListener("keydown", escape, true);
  }, [menu]);
  const [openedPath, setOpenedPath] = React.useState(path);
  const close = () => setMenu("");
  // Touch-sized navigation is deliberate click-to-open, including mouse emulation.
  const desktopHover = (event: React.PointerEvent) => {
    if (window.matchMedia("(max-width: 767px)").matches) event.preventDefault();
  };
  const at = (href: string) =>
    path === href || path.startsWith(href + "/")
      ? ("page" as const)
      : undefined;
  return (
    <>
      {menu && openedPath === path && (
        <button
          type="button"
          tabIndex={-1}
          aria-label="Close navigation"
          className="site-navigation-dismiss"
          onClick={close}
        />
      )}
      <header
        ref={header}
        aria-label="Taplo website"
        className="site-navigation"
      >
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
            key={mobile ? "mobile" : "desktop"}
            value={openedPath === path ? menu : ""}
            onValueChange={(value) => {
              setOpenedPath(path);
              setMenu(value);
            }}
            aria-label="Primary"
            className="site-desktop-navigation"
            delayDuration={150}
          >
            <NavigationMenu.List className="site-navigation-links">
              <NavigationMenu.Item>
                <NavigationMenu.Trigger
                  ref={productTrigger}
                  onPointerMove={desktopHover}
                  onPointerLeave={desktopHover}
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
                                    aria-current={at(link.href)}
                                    onClick={close}
                                    className="site-feature-link"
                                  >
                                    <Icon
                                      data-product-icon={link.href
                                        .split("/")
                                        .at(-1)}
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
                  onPointerMove={desktopHover}
                  onPointerLeave={desktopHover}
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
        </div>
      </header>
    </>
  );
}
