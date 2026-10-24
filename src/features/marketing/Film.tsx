"use client";
import * as React from "react";
import Image, { getImageProps } from "next/image";

/** Silent, inline film. Only plays while visible; device reduced-motion settings use the still. */
export function SilentVideo({
  sources,
  poster,
  phonePoster,
  label,
  testId,
}: {
  sources: { src: string; media?: string }[];
  poster: string;
  phonePoster?: string;
  label: string;
  testId?: string;
}) {
  const host = React.useRef<HTMLDivElement>(null);
  const video = React.useRef<HTMLVideoElement>(null);
  const [visible, setVisible] = React.useState(false);
  const [reduce, setReduce] = React.useState(true);
  React.useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReduce(media.matches);
    sync();
    media.addEventListener("change", sync);
    const observer = new IntersectionObserver(
      ([entry]) => setVisible(Boolean(entry?.isIntersecting)),
      { threshold: 0.15 },
    );
    if (host.current) observer.observe(host.current);
    return () => {
      observer.disconnect();
      media.removeEventListener("change", sync);
    };
  }, []);
  React.useEffect(() => {
    if (visible && !reduce) void video.current?.play().catch(() => {});
    else video.current?.pause();
  }, [visible, reduce]);
  return (
    <div ref={host} className="absolute inset-0">
      {visible && !reduce ? (
        <video
          ref={video}
          data-testid={testId}
          className="absolute inset-0 size-full object-cover"
          autoPlay
          playsInline
          muted
          loop
          preload="metadata"
          poster={poster}
          aria-label={label}
          tabIndex={-1}
        >
          {sources.map((source) => (
            <source
              key={source.src}
              media={source.media}
              src={source.src}
              type="video/mp4"
            />
          ))}
        </video>
      ) : phonePoster ? (
        <picture>
          <source
            media="(max-width:639px)"
            srcSet={
              getImageProps({
                src: phonePoster,
                alt: label,
                width: 1080,
                height: 1920,
                sizes: "90vw",
              }).props.srcSet
            }
          />
          <img
            {...getImageProps({
              src: poster,
              alt: label,
              width: 1920,
              height: 1080,
              sizes: "90vw",
            }).props}
            alt={label}
            className="absolute inset-0 size-full object-cover"
          />
        </picture>
      ) : (
        <Image
          src={poster}
          alt={label}
          fill
          sizes="(min-width:1280px) 1100px, 90vw"
          className="object-cover"
        />
      )}
    </div>
  );
}
/** Compatibility entry point for the continuous product reveal. Walkthroughs keep SilentVideo above. */
export {CinematicFilm as Film} from './CinematicFilm'
