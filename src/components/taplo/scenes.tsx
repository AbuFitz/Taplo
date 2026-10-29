"use client"
import * as React from "react"
import { motion, useReducedMotion } from "motion/react"
import { cn } from "@/lib/utils"

/**
 * Larger product scenes for first-run, empty and locked moments. Monochrome and curved, with one dark accent.
 * Drawn in code: they stay small, follow the page, and show a complete still frame when reduced motion is on.
 */
export type SceneName = "first-run" | "analytics" | "bookings" | "upgrade"

const INK = "#111111", SOFT = "#ececec", SOFTER = "#f4f4f4", MID = "#bdbdbd", SLATE = "#6b6b6b"
const SHADOW = { filter: "drop-shadow(0 10px 22px rgba(17,17,17,.12)) drop-shadow(0 1px 2px rgba(17,17,17,.10))" } as const

function Float({ delay = 0, amp = 5, reduce, children }: { delay?: number; amp?: number; reduce: boolean; children: React.ReactNode }) {
  if (reduce) return <g>{children}</g>
  return <motion.g animate={{ y: [0, -amp, 0] }} transition={{ duration: 5.5, delay, repeat: Infinity, ease: "easeInOut" }}>{children}</motion.g>
}
function Rise({ delay = 0, reduce, children }: { delay?: number; reduce: boolean; children: React.ReactNode }) {
  if (reduce) return <g>{children}</g>
  return <motion.g initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay, ease: "easeOut" }}>{children}</motion.g>
}
const Star = ({ x, y }: { x: number; y: number }) => <path transform={`translate(${x} ${y})`} d="M0-6l1.8 3.8 4.2.6-3 3 .7 4.2L0 3.6-3.7 5.6l.7-4.2-3-3 4.2-.6z" fill={INK} />

function Phone({ reduce, children }: { reduce: boolean; children: React.ReactNode }) {
  return (
    <g style={SHADOW}>
      <rect x="190" y="18" width="190" height="344" rx="36" fill="#fff" stroke={INK} strokeWidth="2.5" />
      <rect x="251" y="30" width="68" height="14" rx="7" fill={INK} />
      <g>{children}</g>
    </g>
  )
}

function QrCard({ reduce }: { reduce: boolean }) {
  const finder = (x: number, y: number) => <g key={`${x}${y}`}><rect x={x} y={y} width="26" height="26" rx="6" fill={INK} /><rect x={x + 6} y={y + 6} width="14" height="14" rx="3" fill="#fff" /><rect x={x + 10} y={y + 10} width="6" height="6" rx="1.5" fill={INK} /></g>
  const dots = [[0,0],[1,0],[0,1],[2,2],[3,1],[1,3],[3,3],[2,0],[0,2],[3,0]]
  return (
    <Float reduce={reduce} delay={0.4}>
      <g style={SHADOW}>
        <rect x="36" y="150" width="128" height="156" rx="24" fill="#fff" />
        {finder(54, 168)}{finder(110, 168)}{finder(54, 214)}
        {dots.map(([a, b], i) => <rect key={i} x={110 + a * 8} y={214 + b * 8} width="6" height="6" rx="1.5" fill={INK} />)}
        <rect x="52" y="266" width="96" height="22" rx="11" fill={SOFTER} />
        <rect x="62" y="274" width="52" height="6" rx="3" fill={SLATE} />
      </g>
    </Float>
  )
}

function Toast({ reduce }: { reduce: boolean }) {
  return (
    <Float reduce={reduce} delay={1.1}>
      <g style={SHADOW}>
        <rect x="366" y="64" width="138" height="58" rx="20" fill="#fff" />
        <circle cx="394" cy="93" r="15" fill={INK} />
        <path d="M387 93l5 5 9-10" fill="none" stroke="#fff" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
        <rect x="418" y="82" width="68" height="8" rx="4" fill={INK} />
        <rect x="418" y="98" width="46" height="6" rx="3" fill={MID} />
      </g>
    </Float>
  )
}

function Calendar({ reduce }: { reduce: boolean }) {
  return (
    <Float reduce={reduce} delay={1.8} amp={4}>
      <g style={SHADOW}>
        <rect x="352" y="244" width="146" height="92" rx="22" fill="#fff" />
        <rect x="368" y="258" width="60" height="8" rx="4" fill={INK} />
        {[0, 1, 2, 3].map((i) => <rect key={i} x={368 + i * 30} y="280" width="22" height="18" rx="7" fill={i === 1 ? INK : SOFT} />)}
        {[0, 1, 2, 3].map((i) => <rect key={i} x={368 + i * 30} y="304" width="22" height="18" rx="7" fill={SOFT} />)}
      </g>
    </Float>
  )
}

function Rating({ reduce }: { reduce: boolean }) {
  return (
    <Float reduce={reduce} delay={0.8} amp={4}>
      <g style={SHADOW}>
        <rect x="44" y="58" width="116" height="38" rx="19" fill="#fff" />
        {[0, 1, 2, 3, 4].map((i) => <Star key={i} x={66 + i * 18} y={77} />)}
      </g>
    </Float>
  )
}

function FirstRun({ reduce }: { reduce: boolean }) {
  return (
    <>
      <circle cx="290" cy="192" r="176" fill={SOFTER} />
      <circle cx="300" cy="200" r="120" fill={SOFT} opacity=".55" />
      <Rating reduce={reduce} />
      <QrCard reduce={reduce} />
      <Phone reduce={reduce}>
        <Rise reduce={reduce} delay={0.1}>
          <rect x="204" y="58" width="162" height="92" rx="18" fill="#d9d9d9" />
          <path d="M204 128l40-34 30 24 26-20 66 32v20H204z" fill="#c4c4c4" />
          <circle cx="338" cy="80" r="9" fill="#f1f1f1" />
        </Rise>
        <Rise reduce={reduce} delay={0.25}><circle cx="232" cy="152" r="21" fill={INK} stroke="#fff" strokeWidth="4" /></Rise>
        <Rise reduce={reduce} delay={0.4}><rect x="204" y="184" width="100" height="13" rx="6.5" fill={INK} /><rect x="204" y="205" width="136" height="8" rx="4" fill={MID} /></Rise>
        <Rise reduce={reduce} delay={0.55}><rect x="204" y="226" width="162" height="32" rx="16" fill={INK} /><rect x="254" y="239" width="62" height="6" rx="3" fill="#fff" /></Rise>
        <Rise reduce={reduce} delay={0.7}><circle cx="216" cy="276" r="11" fill={SOFT} /><circle cx="242" cy="276" r="11" fill={SOFT} /></Rise>
        <Rise reduce={reduce} delay={0.85}>
          <rect x="204" y="298" width="74" height="7" rx="3.5" fill={SLATE} /><rect x="330" y="298" width="36" height="7" rx="3.5" fill={INK} />
          <rect x="204" y="320" width="58" height="7" rx="3.5" fill={SLATE} /><rect x="334" y="320" width="32" height="7" rx="3.5" fill={INK} />
        </Rise>
      </Phone>
      <Toast reduce={reduce} />
      <Calendar reduce={reduce} />
    </>
  )
}

function Analytics({ reduce }: { reduce: boolean }) {
  const bars = [34, 54, 42, 78, 60, 96, 120]
  return (
    <>
      <circle cx="270" cy="190" r="170" fill={SOFTER} />
      <Float reduce={reduce} amp={3}>
        <g style={SHADOW}>
          <rect x="86" y="62" width="348" height="236" rx="28" fill="#fff" />
          <rect x="112" y="88" width="84" height="10" rx="5" fill={INK} />
          <rect x="112" y="108" width="124" height="7" rx="3.5" fill={MID} />
          {bars.map((h, i) => (
            <Rise key={i} reduce={reduce} delay={0.1 + i * 0.08}>
              <rect x={116 + i * 44} y={266 - h} width="28" height={h} rx="10" fill={i === bars.length - 1 ? INK : SOFT} stroke={i === bars.length - 1 ? "none" : MID} strokeDasharray="4 4" strokeWidth="1.4" />
            </Rise>
          ))}
          <path d="M130 232C170 218 200 200 240 206S320 170 392 124" fill="none" stroke={INK} strokeWidth="2.4" strokeLinecap="round" strokeDasharray="2 7" />
        </g>
      </Float>
      <Float reduce={reduce} delay={0.9}>
        <g style={SHADOW}>
          <rect x="344" y="38" width="124" height="52" rx="20" fill="#fff" />
          <circle cx="370" cy="64" r="13" fill={INK} /><path d="M365 64h10M370 59v10" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" />
          <rect x="392" y="55" width="52" height="8" rx="4" fill={INK} /><rect x="392" y="70" width="34" height="6" rx="3" fill={MID} />
        </g>
      </Float>
    </>
  )
}

function Bookings({ reduce }: { reduce: boolean }) {
  return (
    <>
      <circle cx="270" cy="190" r="170" fill={SOFTER} />
      <Float reduce={reduce} amp={3}>
        <g style={SHADOW}>
          <rect x="96" y="54" width="268" height="260" rx="28" fill="#fff" />
          <rect x="122" y="80" width="96" height="11" rx="5.5" fill={INK} />
          {[0, 1, 2, 3, 4, 5, 6].map((i) => <rect key={i} x={122 + i * 32} y="108" width="24" height="26" rx="9" fill={i === 2 ? INK : SOFT} />)}
          {[0, 1, 2].map((r) => [0, 1, 2].map((c) => <rect key={`${r}${c}`} x={122 + c * 76} y={158 + r * 44} width="66" height="32" rx="12" fill={r === 1 && c === 1 ? INK : SOFTER} stroke={r === 1 && c === 1 ? "none" : SOFT} />))}
          <rect x="198" y="209" width="34" height="6" rx="3" fill="#fff" />
        </g>
      </Float>
      <Float reduce={reduce} delay={1}>
        <g style={SHADOW}>
          <rect x="316" y="212" width="170" height="86" rx="24" fill="#fff" />
          <circle cx="348" cy="245" r="16" fill={INK} /><path d="M341 245l5 5 10-11" fill="none" stroke="#fff" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
          <rect x="374" y="232" width="80" height="9" rx="4.5" fill={INK} /><rect x="374" y="250" width="56" height="7" rx="3.5" fill={MID} /><rect x="332" y="274" width="122" height="12" rx="6" fill={SOFT} />
        </g>
      </Float>
    </>
  )
}

function Upgrade({ reduce }: { reduce: boolean }) {
  return (
    <>
      <circle cx="270" cy="190" r="170" fill={SOFTER} />
      <Float reduce={reduce} amp={3}>
        <g style={SHADOW}>
          <rect x="112" y="64" width="296" height="232" rx="28" fill="#fff" />
          <rect x="140" y="92" width="92" height="11" rx="5.5" fill={INK} />
          {[0, 1, 2].map((i) => <g key={i}><rect x={140} y={122 + i * 44} width="200" height="32" rx="12" fill={SOFTER} stroke={SOFT} /><circle cx="160" cy={138 + i * 44} r="8" fill={i === 0 ? INK : MID} /><rect x="178" y={134 + i * 44} width={90 - i * 16} height="8" rx="4" fill={i === 0 ? INK : MID} /></g>)}
        </g>
      </Float>
      <Float reduce={reduce} delay={0.8}>
        <g style={SHADOW}>
          <rect x="352" y="150" width="92" height="104" rx="26" fill={INK} />
          <path d="M376 190v-10a22 22 0 0 1 44 0v10" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" />
          <rect x="370" y="190" width="56" height="42" rx="14" fill="#fff" />
          <circle cx="398" cy="208" r="5" fill={INK} /><rect x="396" y="212" width="4" height="10" rx="2" fill={INK} />
        </g>
      </Float>
    </>
  )
}

export function Scene({ name, className, label }: { name: SceneName; className?: string; label?: string }) {
  const reduce = !!useReducedMotion()
  const art = { "first-run": FirstRun, analytics: Analytics, bookings: Bookings, upgrade: Upgrade }[name]
  const Art = art
  return (
    <svg viewBox="0 0 520 380" className={cn("h-auto w-full", className)} role={label ? "img" : undefined} aria-label={label} aria-hidden={label ? undefined : true} focusable="false">
      <Art reduce={reduce} />
    </svg>
  )
}
