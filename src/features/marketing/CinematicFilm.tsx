"use client";
import * as React from "react";
import Link from "next/link";
import { motion, useSpring } from "motion/react";
import { ArrowUpRight } from "lucide-react";
import { createAlphaVideoRenderer } from "./cinema/alpha-video";
/** A continuous rendered film, composited transparently with one ordinary browser video decode. */
export function CinematicFilm() {
  const host = React.useRef<HTMLDivElement>(null),
    video = React.useRef<HTMLVideoElement>(null),
    canvas = React.useRef<HTMLCanvasElement>(null);
  const [visible, setVisible] = React.useState(false),
    [reduce, setReduce] = React.useState(true),
    [active, setActive] = React.useState(true),
    [prepared, setPrepared] = React.useState(false),
    [mobile, setMobile] = React.useState(true),
    [readyFormat, setReadyFormat] = React.useState<string>(),
    [failed, setFailed] = React.useState(false),
    [held, setHeld] = React.useState(false),
    [focused, setFocused] = React.useState(false);
  const x = useSpring(0, { stiffness: 200, damping: 25 }),
    y = useSpring(0, { stiffness: 200, damping: 25 });
  React.useEffect(() => {
    let inView = false;
    const motionQuery = matchMedia("(prefers-reduced-motion: reduce)"),
      sizeQuery = matchMedia("(max-width:639px)");
    const sync = () => {
      setReduce(motionQuery.matches);
      setMobile(sizeQuery.matches);
      setActive(!document.hidden);
      if (inView && !motionQuery.matches && !document.hidden) setPrepared(true);
    };
    sync();
    const observer = new IntersectionObserver(
      ([entry]) => {
        inView = Boolean(entry?.isIntersecting);
        setVisible(inView);
        sync();
      },
      { threshold: 0.15 },
    );
    if (host.current) observer.observe(host.current);
    motionQuery.addEventListener("change", sync);
    sizeQuery.addEventListener("change", sync);
    document.addEventListener("visibilitychange", sync);
    return () => {
      observer.disconnect();
      motionQuery.removeEventListener("change", sync);
      sizeQuery.removeEventListener("change", sync);
      document.removeEventListener("visibilitychange", sync);
    };
  }, []);
  const running = visible && !reduce && active && !held && !focused && !failed;
  const format = mobile ? "portrait" : "landscape",
    file = `/marketing/reveal/${format}-packed.mp4`;
  const ready = readyFormat === format;
  React.useEffect(() => {
    if (!prepared || !canvas.current || !video.current) return;
    const c = canvas.current,
      v = video.current;
    let renderer: ReturnType<typeof createAlphaVideoRenderer> | undefined,
      frame = 0,
      rvfc = 0,
      disposed = false,
      announced = false;
    const fail = () => {
      if (!disposed) setFailed(true);
    };
    const stop = () => {
      cancelAnimationFrame(frame);
      if (rvfc && v.cancelVideoFrameCallback) v.cancelVideoFrameCallback(rvfc);
      frame = rvfc = 0;
    };
    const draw = () => {
      if (disposed) return;
      try {
        if (renderer?.draw() && !announced && v.currentTime > 0.02) {
          announced = true;
          setReadyFormat(format);
        }
      } catch {
        fail();
      }
    };
    const loop = () => {
      draw();
      if (!disposed && !v.paused) {
        if (v.requestVideoFrameCallback)
          rvfc = v.requestVideoFrameCallback(loop);
        else frame = requestAnimationFrame(loop);
      }
    };
    const start = () => {
      stop();
      loop();
    };
    const contextLost = (event: Event) => {
      event.preventDefault();
      fail();
    };
    try {
      renderer = createAlphaVideoRenderer(c, v);
      v.addEventListener("loadeddata", draw);
      v.addEventListener("seeked", draw);
      v.addEventListener("play", start);
      v.addEventListener("pause", stop);
      v.addEventListener("error", fail);
      c.addEventListener("webglcontextlost", contextLost);
      if (v.readyState >= 2) draw();
      if (!v.paused) start();
    } catch {
      fail();
    }
    return () => {
      disposed = true;
      stop();
      v.removeEventListener("loadeddata", draw);
      v.removeEventListener("seeked", draw);
      v.removeEventListener("play", start);
      v.removeEventListener("pause", stop);
      v.removeEventListener("error", fail);
      c.removeEventListener("webglcontextlost", contextLost);
      renderer?.dispose();
    };
  }, [prepared, format]);
  React.useEffect(() => {
    const v = video.current;
    if (!v) return;
    if (running) void v.play().catch(() => {});
    else v.pause();
  }, [running, prepared, mobile]);
  const poster = !ready || reduce || failed;
  return (
    <div
      ref={host}
      data-testid="cinematic-film"
      data-running={running}
      data-ready={ready}
      data-format={format}
      data-fallback={failed}
      onMouseEnter={() => setHeld(true)}
      onMouseLeave={() => {
        setHeld(false);
        x.set(0);
        y.set(0);
      }}
      onFocusCapture={() => setFocused(true)}
      onBlurCapture={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget)) setFocused(false);
      }}
    >
      <Link
        href="/product"
        aria-label="Explore Taplo after the product animation"
        className="cinematic-link"
        onPointerMove={(e) => {
          if (e.pointerType !== "mouse" || reduce) return;
          const r = e.currentTarget.getBoundingClientRect();
          x.set((-(e.clientY - r.y - r.height / 2) / r.height) * 3);
          y.set(((e.clientX - r.x - r.width / 2) / r.width) * 3);
        }}
      >
        <motion.div
          className="cinematic-stage"
          style={{ rotateX: x, rotateY: y }}
          whileTap={reduce ? undefined : { scale: 0.985 }}
          transition={{ type: "spring", stiffness: 350, damping: 28 }}
        >
          <picture
            className="cinematic-poster"
            style={{ visibility: poster ? "visible" : "hidden" }}
          >
            <source
              media="(max-width:639px)"
              srcSet="/marketing/reveal/portrait-poster.png"
            />
            <img
              src="/marketing/reveal/landscape-poster.png"
              alt="Taplo business page and a matching scannable counter plaque"
              width={1280}
              height={800}
            />
          </picture>
          <canvas
            ref={canvas}
            aria-hidden="true"
            data-testid="cinematic-canvas"
            className="cinematic-canvas"
            style={{ visibility: poster ? "hidden" : "visible" }}
          />
          {prepared ? (
            <video
              key={file}
              ref={video}
              src={file}
              muted
              loop
              autoPlay
              playsInline
              preload="metadata"
              aria-hidden="true"
              tabIndex={-1}
              data-testid="cinematic-source"
              className="cinematic-source"
            />
          ) : null}
        </motion.div>
      </Link>
      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
        <p className="max-w-lg text-xs leading-relaxed opacity-65">
          A business page comes together, brings the next step closer, and
          becomes something you can share.
        </p>
        <Link
          href="/product"
          className="inline-flex min-h-11 items-center gap-2 rounded text-sm font-semibold underline underline-offset-4"
        >
          Explore Taplo
          <ArrowUpRight aria-hidden="true" size={16} />
        </Link>
      </div>
      <p className="sr-only">
        Silent product animation. Keyboard focus pauses playback. With reduced
        motion, a still image is shown. Demonstration interfaces; no booking is
        sent.
      </p>
    </div>
  );
}
