import {
  CalendarDays,
  Car,
  Package,
  Star,
  MapPin,
  Play,
  Phone,
  Check,
} from "lucide-react";
import type { ContentChoice } from "./content-model";
import "./content-art.css";
/** Small, purposeful diagrams. These explain the content format; they never create business records. */
export function ContentIllustration({ choice }: { choice: ContentChoice }) {
  const art = choice.art;
  const calendar = choice.type === "booking" || art === "clock";
  const people = art === "avatars";
  const images = ["photos", "grid", "cards", "beforeAfter"].includes(art);
  const Icon =
    choice.id === "vehicles"
      ? Car
      : choice.type === "reviews"
        ? Star
        : choice.group === "reach"
          ? Phone
          : choice.type === "video"
            ? Play
            : choice.type === "location" || choice.type === "serviceArea"
              ? MapPin
              : Package;
  return (
    <span
      className="content-art"
      data-group={choice.group}
      data-art={art}
      aria-hidden="true"
    >
      {calendar ? (
        <span className="content-art-calendar">
          <b>
            <CalendarDays />
            Pick a time
          </b>
          <span>
            {Array.from({ length: 14 }, (_, i) => (
              <i key={i} data-active={i === 9}>
                {i + 1}
              </i>
            ))}
          </span>
          <em>
            09:30 <strong>10:00</strong> 10:30
          </em>
        </span>
      ) : people ? (
        <span className="content-art-people">
          {["A", "B", "C"].map((v, i) => (
            <span key={v}>
              <i data-person={i}>{v}</i>
              <b />
              <small />
            </span>
          ))}
        </span>
      ) : images ? (
        <span className="content-art-gallery">
          {[0, 1, 2].map((i) => (
            <span key={i}>
              <i />
              <b />
            </span>
          ))}
        </span>
      ) : choice.type === "reviews" ? (
        <span className="content-art-review">
          <b>★★★★★</b>
          <i />
          <i />
          <span>
            <small />
            Customer review
          </span>
        </span>
      ) : ["list", "text", "quote", "chips"].includes(art) ? (
        <span className="content-art-list">
          {[0, 1, 2].map((i) => (
            <span key={i}>
              <i />
              <b />
              <small />
            </span>
          ))}
        </span>
      ) : (
        <span className="content-art-action">
          <Icon />
          <span>{choice.group === "reach" ? "Let’s talk" : choice.name}</span>
          <Check />
        </span>
      )}
    </span>
  );
}
