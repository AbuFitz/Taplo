"use client";
import * as React from "react";
import { Play } from "lucide-react";
import { TaskDemo } from "./TaskDemo";
import type { JourneyId } from "./journeys";
const FILMS = {
  bookings: {
    file: "booking",
    label: "booking",
    text: "The customer chooses a consultation lasting 30 minutes and costing £35, selects an available time, and sends a request. The request is awaiting the business’s review; it is not automatically confirmed.",
  },
  profile: {
    file: "profile",
    label: "profile layout",
    text: "A name-led page works without images. A profile logo has its own space and keeps its proportions. Adding a cover gives the introduction a different hierarchy while keeping the name and main action clear.",
  },
  order: {
    file: "order",
    label: "reordering",
    text: "Pick up the dotted handle, move Services above Gallery, then release it to save the order. Undo restores the previous arrangement. Keyboard users can use Space, the arrow keys and Space; Escape cancels.",
  },
} as const;
export function GuideFilm({
  topic,
  industry,
}: {
  topic: JourneyId;
  industry?: string;
}) {
  const video = React.useRef<HTMLVideoElement>(null);
  const [started, setStarted] = React.useState(false),
    [failed, setFailed] = React.useState(false);
  const film = FILMS[topic as keyof typeof FILMS];
  if (!film || failed)
    return (
      <>
        {failed ? (
          <p className="guide-film-fallback" role="status">
            The film could not load. You can explore the same steps below.
          </p>
        ) : null}
        <TaskDemo topic={topic} industry={industry} />
      </>
    );
  return (
    <div className="guide-film">
      <div className="guide-film-stage">
        <video
          ref={video}
          controls
          playsInline
          preload="none"
          poster={`/guides/${film.file}-walkthrough.jpg`}
          src={`/guides/${film.file}-walkthrough.mp4`}
          aria-label={`${film.label} walkthrough. Illustrative example.`}
          onPlay={() => setStarted(true)}
          onError={() => setFailed(true)}
        >
          <track
            kind="captions"
            src={`/guides/${film.file}-walkthrough.vtt`}
            srcLang="en"
            label="English"
          />
        </video>
        {!started ? (
          <button
            type="button"
            className="guide-film-play"
            onClick={async () => {
              try {
                await video.current?.play();
              } catch {
                setFailed(true);
              }
            }}
          >
            <Play />
            Play 9-second walkthrough
          </button>
        ) : null}
      </div>
      <details className="guide-film-transcript">
        <summary>Read the video description</summary>
        <p>{film.text}</p>
      </details>
      <details className="guide-film-interactive">
        <summary>Explore the steps interactively</summary>
        <TaskDemo topic={topic} industry={industry} />
      </details>
    </div>
  );
}
