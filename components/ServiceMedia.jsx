"use client";
import { useRef, useState } from "react";
import { Pause, Play, Scissors, Sparkles } from "lucide-react";
import { resolveMedia } from "@/lib/service-media";

/**
 * Editorial still image with an optional muted motion preview.
 * Hover plays it on desktop; the small button also makes it usable on touch.
 */
export default function ServiceMedia({ service, alt, className = "", category = "" }) {
  const { image, video } = resolveMedia(service);
  const videoRef = useRef(null);
  const [playing, setPlaying] = useState(false);

  function start() {
    const node = videoRef.current;
    if (!node) return;
    const attempt = node.play();
    if (attempt?.then) attempt.then(() => setPlaying(true)).catch(() => setPlaying(false));
  }

  function stop() {
    const node = videoRef.current;
    if (!node) return;
    node.pause();
    setPlaying(false);
  }

  function toggle(event) {
    event.stopPropagation();
    event.preventDefault();
    if (playing) stop();
    else start();
  }

  return (
    <div className={`group/media relative overflow-hidden bg-berry-50 ${className}`}
      onMouseEnter={video ? start : undefined}
      onMouseLeave={video ? stop : undefined}>
      {image ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={image}
          alt={alt || service?.serviceName || ""}
          loading="lazy"
          className={`absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-110 ${playing ? "opacity-0" : "opacity-100"}`}
        />
      ) : (
        <div className="flex h-full items-center justify-center text-berry-300"><Scissors className="h-10 w-10" /></div>
      )}

      {video && (
        <video
          ref={videoRef}
          src={video}
          poster={image || undefined}
          muted
          loop
          playsInline
          preload="none"
          aria-label={`${alt || service?.serviceName} preview`}
          className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-500 ${playing ? "opacity-100" : "opacity-0"}`}
        />
      )}

      {category && (
        <>
          <div aria-hidden className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/45 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover/media:opacity-100" />
          <span className="pointer-events-none absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full bg-white/95 px-3 py-1.5 text-[11px] font-semibold text-berry-700 shadow-sm backdrop-blur">
            <Sparkles className="h-3 w-3" />{category}
          </span>
        </>
      )}

      {video && (
        <button
          type="button"
          onClick={toggle}
          aria-label={playing ? "Pause preview" : "Play preview"}
          className="absolute bottom-3 right-3 z-10 inline-flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-berry-700 shadow-sm backdrop-blur transition hover:scale-105 hover:bg-white"
        >
          {playing ? <Pause className="h-3.5 w-3.5" /> : <Play className="ml-0.5 h-3.5 w-3.5" />}
        </button>
      )}
    </div>
  );
}
