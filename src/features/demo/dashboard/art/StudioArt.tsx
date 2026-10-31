import * as React from "react";
export type StudioScene =
  | "services"
  | "bookings"
  | "products"
  | "team"
  | "reviews"
  | "analytics"
  | "settings"
  | "design";
const COLOURS: Record<StudioScene, [string, string, string]> = {
  services: ["#d8e1ff", "#adc5fb", "#f8dce5"],
  bookings: ["#e8ddff", "#bfafe9", "#c9ece3"],
  products: ["#f7d9cb", "#eab8a5", "#d2ddff"],
  team: ["#ccebe3", "#9ed2c2", "#f5e0af"],
  reviews: ["#f5e6b5", "#ddc984", "#e1d5f1"],
  analytics: ["#d0eaf4", "#9ac9de", "#f2cfdc"],
  settings: ["#e8dfee", "#c5afd4", "#d5e8cd"],
  design: ["#f0d6e7", "#d4a8c5", "#d7e8be"],
};
/** Original editable dimensional artwork. Decorative; contains no metrics or customer records. */
export function StudioArt({
  scene,
  className,
}: {
  scene: StudioScene;
  className?: string;
}) {
  const id = React.useId().replace(/:/g, "");
  const [a, b, c] = COLOURS[scene];
  const g = (name: string) => `url(#${id}-${name})`;
  return (
    <svg
      className={className}
      viewBox="0 0 320 220"
      fill="none"
      aria-hidden="true"
      focusable="false"
      data-studio-art={scene}
    >
      <defs>
        <linearGradient
          id={`${id}-body`}
          x1="40"
          y1="15"
          x2="250"
          y2="210"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#fff" />
          <stop offset="1" stopColor={a} />
        </linearGradient>
        <linearGradient id={`${id}-glass`} x1="0" y1="0" x2="1" y2="1">
          <stop stopColor="#fff" stopOpacity=".95" />
          <stop offset="1" stopColor={c} stopOpacity=".8" />
        </linearGradient>
        <linearGradient id={`${id}-accent`} x1="0" y1="0" x2="1" y2="1">
          <stop stopColor={a} />
          <stop offset="1" stopColor={b} />
        </linearGradient>
        <radialGradient id={`${id}-sphere`} cx=".3" cy=".2" r=".8">
          <stop stopColor="#fff" />
          <stop offset=".35" stopColor={a} />
          <stop offset="1" stopColor={b} />
        </radialGradient>
        <filter
          id={`${id}-shadow`}
          x="-70%"
          y="-70%"
          width="240%"
          height="270%"
        >
          <feDropShadow
            dx="0"
            dy="12"
            stdDeviation="10"
            floodColor="#28334b"
            floodOpacity=".12"
          />
        </filter>
        <filter id={`${id}-ground`}>
          <feGaussianBlur stdDeviation="8" />
        </filter>
      </defs>
      <ellipse
        cx="166"
        cy="190"
        rx="88"
        ry="9"
        fill={b}
        opacity=".28"
        filter={g("ground")}
      />
      {scene === "bookings" ? (
        <g filter={g("shadow")}>
          <g transform="translate(88 36) rotate(-10 80 75)">
            <rect x="5" y="8" width="150" height="135" rx="23" fill={b} />
            <rect
              width="150"
              height="135"
              rx="23"
              fill={g("body")}
              stroke="#fff"
              strokeWidth="2"
            />
            <path d="M1 38H149" stroke={b} strokeOpacity=".5" />
            {[32, 117].map((x) => (
              <g key={x}>
                <path
                  d={`M${x} 13V-4`}
                  stroke={b}
                  strokeWidth="8"
                  strokeLinecap="round"
                />
                <path
                  d={`M${x - 1} 10V-5`}
                  stroke="#fff"
                  strokeWidth="3"
                  strokeLinecap="round"
                />
              </g>
            ))}
            {Array.from({ length: 21 }, (_, i) => (
              <rect
                key={i}
                x={20 + (i % 7) * 16}
                y={54 + Math.floor(i / 7) * 23}
                width="9"
                height="9"
                rx="3"
                fill={i === 10 ? "#25252b" : b}
                opacity={i === 10 ? 1 : 0.4}
              />
            ))}
          </g>
          <g transform="translate(174 140) rotate(8)">
            <rect x="2" y="4" width="103" height="40" rx="13" fill={b} />
            <rect
              width="103"
              height="40"
              rx="13"
              fill={g("glass")}
              stroke="#fff"
              strokeWidth="2"
            />
            <circle cx="22" cy="20" r="10" fill="#25252b" />
            <path
              d="m18 20 3 3 5-6"
              stroke="#fff"
              strokeWidth="2"
              strokeLinecap="round"
            />
            <path
              d="M42 16H82M42 24H68"
              stroke={b}
              strokeWidth="4"
              strokeLinecap="round"
            />
          </g>
        </g>
      ) : scene === "services" ? (
        <g filter={g("shadow")}>
          <g transform="translate(66 40) rotate(-12 85 65)">
            <rect x="-8" y="15" width="148" height="131" rx="18" fill={a} />
            <rect x="8" y="7" width="148" height="131" rx="18" fill={b} />
            <rect
              x="18"
              width="148"
              height="131"
              rx="18"
              fill={g("body")}
              stroke="#fff"
              strokeWidth="2"
            />
            {[30, 56, 82].map((y) => (
              <g key={y}>
                <rect x="34" y={y - 7} width="18" height="18" rx="5" fill={c} />
                <path
                  d={`M63 ${y}H110M130 ${y}H147`}
                  stroke={b}
                  strokeWidth="5"
                  strokeLinecap="round"
                />
              </g>
            ))}
            <rect
              x="34"
              y="105"
              width="116"
              height="11"
              rx="5.5"
              fill="#25252b"
            />
          </g>
          <g transform="translate(221 137)">
            <circle r="34" fill={g("sphere")} />
            <circle
              cx="-7"
              cy="-6"
              r="8"
              fill="none"
              stroke="#fff"
              strokeWidth="3"
            />
            <circle
              cx="7"
              cy="6"
              r="8"
              fill="none"
              stroke="#fff"
              strokeWidth="3"
            />
            <path
              d="m-1-1 12-18M1 1l-12 18"
              stroke="#fff"
              strokeWidth="3"
              strokeLinecap="round"
            />
          </g>
        </g>
      ) : scene === "products" ? (
        <g filter={g("shadow")}>
          <g transform="translate(74 43) rotate(-10 55 68)">
            <path d="M8 37 94 29l13 116-99 6Z" fill={b} />
            <path
              d="M0 28 89 22l10 118-99 5Z"
              fill={g("body")}
              stroke="#fff"
              strokeWidth="2"
            />
            <path
              d="M23 44V19C23-10 67-10 67 16v25"
              stroke={b}
              strokeWidth="7"
              strokeLinecap="round"
            />
            <path
              d="M21 42V17C21-12 65-12 65 14v25"
              stroke="#fff"
              strokeWidth="3"
              strokeLinecap="round"
            />
          </g>
          <g transform="translate(160 105) rotate(7)">
            <path d="m0 21 48-23 61 20-46 25Z" fill={c} />
            <path d="m0 21 63 22v61L0 81Z" fill="#bbcbed" />
            <path d="m63 43 46-25v63l-46 23Z" fill="#97aed8" />
            <path d="m25 9 63 22v21L76 59V38L13 16Z" fill="#ffffffb3" />
          </g>
        </g>
      ) : scene === "team" ? (
        <g filter={g("shadow")}>
          {[
            { x: 55, y: 67, r: -12, h: 105, face: c },
            { x: 119, y: 30, r: 0, h: 132, face: a },
            { x: 193, y: 62, r: 12, h: 110, face: "#e5d7f3" },
          ].map((p, i) => (
            <g
              key={i}
              transform={`translate(${p.x} ${p.y}) rotate(${p.r} 35 60)`}
            >
              <rect x="3" y="5" width="76" height={p.h} rx="18" fill={b} />
              <rect
                width="76"
                height={p.h}
                rx="18"
                fill={g("body")}
                stroke="#fff"
                strokeWidth="2"
              />
              <rect
                x="8"
                y="9"
                width="60"
                height={p.h - 38}
                rx="12"
                fill={p.face}
              />
              <circle
                cx="38"
                cy={p.h / 2 - 19}
                r="14"
                fill="#fff"
                fillOpacity=".85"
              />
              <path
                d={`M14 ${p.h - 34}q2-27 24-27t24 27`}
                fill="#fff"
                fillOpacity=".85"
              />
              <rect x="21" y={p.h - 21} width="34" height="4" rx="2" fill={b} />
            </g>
          ))}
        </g>
      ) : scene === "reviews" ? (
        <g filter={g("shadow")}>
          <g transform="translate(62 42) rotate(-8 91 62)">
            <path
              d="M12 5h162a18 18 0 0 1 18 18v85a18 18 0 0 1-18 18H68l-30 22v-22H12a18 18 0 0 1-18-18V23A18 18 0 0 1 12 5"
              fill={b}
            />
            <path
              d="M8 0h162a18 18 0 0 1 18 18v85a18 18 0 0 1-18 18H64l-30 22v-22H8a18 18 0 0 1-18-18V18A18 18 0 0 1 8 0"
              fill={g("body")}
              stroke="#fff"
              strokeWidth="2"
            />
            {[0, 1, 2, 3, 4].map((i) => (
              <path
                key={i}
                d="m0-9 3 6 7 1-5 5 1 7-6-3-6 3 1-7-5-5 7-1Z"
                fill={b}
                transform={`translate(${24 + i * 31} 34)`}
              />
            ))}
            <path
              d="M20 67H149M20 82H119"
              stroke={b}
              strokeOpacity=".55"
              strokeWidth="5"
              strokeLinecap="round"
            />
          </g>
          <circle
            cx="245"
            cy="157"
            r="29"
            fill={g("glass")}
            stroke="#fff"
            strokeWidth="2"
          />
          <path
            d="m234 157 8 8 14-17"
            stroke="#716180"
            strokeWidth="5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </g>
      ) : scene === "analytics" ? (
        <g filter={g("shadow")}>
          <path
            d="M52 170 160 120 277 161 165 208Z"
            fill={g("glass")}
            stroke="#fff"
            strokeWidth="2"
          />
          {[
            { x: 89, y: 112, h: 55 },
            { x: 137, y: 71, h: 96 },
            { x: 185, y: 40, h: 127 },
          ].map((p, i) => (
            <g key={i}>
              <path
                d={`m${p.x} ${p.y} 20-10 22 8-20 11Z`}
                fill={i === 1 ? c : a}
              />
              <path
                d={`m${p.x} ${p.y} 22 9v${p.h}l-22-9Z`}
                fill={i === 1 ? "#d7afc0" : b}
              />
              <path
                d={`m${p.x + 22} ${p.y + 9} 20-11v${p.h}l-20 11Z`}
                fill={i === 1 ? "#bb8b9f" : "#7daec3"}
              />
            </g>
          ))}
          <path
            d="m56 114 54-28 38 9 61-55"
            stroke="#fff"
            strokeWidth="5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <circle cx="209" cy="40" r="8" fill="#fff" />
        </g>
      ) : scene === "settings" ? (
        <g filter={g("shadow")} transform="translate(72 43) rotate(-10 86 62)">
          <rect x="6" y="8" width="174" height="128" rx="28" fill={b} />
          <rect
            width="174"
            height="128"
            rx="28"
            fill={g("body")}
            stroke="#fff"
            strokeWidth="2"
          />
          {[30, 64, 98].map((y, i) => (
            <g key={y}>
              <path
                d={`M26 ${y}H148`}
                stroke={a}
                strokeWidth="9"
                strokeLinecap="round"
              />
              <path
                d={`M26 ${y}H${i === 1 ? 111 : 65}`}
                stroke={b}
                strokeWidth="9"
                strokeLinecap="round"
              />
              <circle cx={i === 1 ? 111 : 65} cy={y + 2} r="12" fill={b} />
              <circle
                cx={i === 1 ? 111 : 65}
                cy={y}
                r="12"
                fill="#fff"
                stroke={a}
                strokeWidth="2"
              />
            </g>
          ))}
        </g>
      ) : (
        <g filter={g("shadow")}>
          {[
            { r: -24, fill: a },
            { r: 0, fill: c },
            { r: 24, fill: "#cee8ef" },
          ].map((p, i) => (
            <g key={i} transform={`translate(114 30) rotate(${p.r} 46 137)`}>
              <rect x="4" y="5" width="92" height="150" rx="17" fill={b} />
              <rect
                width="92"
                height="150"
                rx="17"
                fill={p.fill}
                stroke="#fff"
                strokeWidth="2"
              />
              <rect
                x="9"
                y="70"
                width="74"
                height="70"
                rx="10"
                fill="#fff"
                fillOpacity=".8"
              />
              <rect
                x="19"
                y="92"
                width="54"
                height="7"
                rx="3.5"
                fill="#25252b"
              />
              <rect
                x="19"
                y="111"
                width="54"
                height="7"
                rx="3.5"
                fill="#25252b"
              />
              <circle cx="46" cy="34" r="14" fill="#fff" fillOpacity=".8" />
            </g>
          ))}
        </g>
      )}
    </svg>
  );
}
