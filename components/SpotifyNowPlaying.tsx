'use client'

import Image from "next/image";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

import { formatTime } from "@/lib/util";

type PlaybackResponse =
  | {
      connected: false;
    }
  | {
      connected: true;
      hasTrack: false;
    }
  | {
      connected: true;
      hasTrack: true;
      isPlaying: boolean;
      track: {
        title: string;
        artists: string;
        album: string;
        albumArtUrl: string | null;
        durationMs: number;
        progressMs: number;
        externalUrl: string;
      };
    };

export function SpotifyNowPlaying() {
  const { status } = useSession();
  const [playback, setPlayback] = useState<PlaybackResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [liveProgressMs, setLiveProgressMs] = useState(0);

  useEffect(() => {
    if (status === "loading") {
      return;
    }

    if (status === "unauthenticated") {
      setPlayback({ connected: false });
      setIsLoading(false);
      return;
    }

    let isCancelled = false;

    async function fetchPlayback() {
      try {
        const response = await fetch("/api/spotify/now-playing", { cache: "no-store" });
        const data = (await response.json()) as PlaybackResponse;

        if (isCancelled) {
          return;
        }

        setPlayback(data);

        if (data.connected && data.hasTrack) {
          setLiveProgressMs(data.track.progressMs);
        }
      } catch {
        if (!isCancelled) {
          setPlayback({ connected: true, hasTrack: false });
        }
      } finally {
        if (!isCancelled) {
          setIsLoading(false);
        }
      }
    }

    fetchPlayback();
    const intervalId = window.setInterval(fetchPlayback, 15000);

    return () => {
      isCancelled = true;
      window.clearInterval(intervalId);
    };
  }, [status]);

  useEffect(() => {
    if (!playback || !playback.connected || !playback.hasTrack) {
      return;
    }

    setLiveProgressMs(playback.track.progressMs);

    if (!playback.isPlaying) {
      return;
    }

    const intervalId = window.setInterval(() => {
      setLiveProgressMs((current) => Math.min(current + 1000, playback.track.durationMs));
    }, 1000);

    return () => window.clearInterval(intervalId);
  }, [playback]);

  if (isLoading) {
    return (
      <div className="rounded-2xl border border-white/8 bg-black/15 p-4">
        <p className="text-sm text-white/40">Spotify</p>
        <p className="mt-2 text-sm text-white/60">Loading current playback...</p>
      </div>
    );
  }

  if (!playback || !playback.connected) {
    return (
      <div className="rounded-2xl border border-white/8 bg-black/15 p-4">
        <p className="text-sm text-white/40">Spotify</p>
        <p className="mt-2 text-lg font-semibold text-white">Connect Spotify</p>
        <p className="mt-1 text-sm text-white/50">Sign in to show the current track and playback progress.</p>
      </div>
    );
  }

  if (!playback.hasTrack) {
    return (
      <div className="rounded-2xl border border-white/8 bg-black/15 p-4">
        <p className="text-sm text-white/40">Spotify</p>
        <p className="mt-2 text-lg font-semibold text-white">Nothing is playing</p>
        <p className="mt-1 text-sm text-white/50">Start playback on Spotify and this panel will update automatically.</p>
      </div>
    );
  }

  const progressSeconds = Math.floor(liveProgressMs / 1000);
  const durationSeconds = Math.floor(playback.track.durationMs / 1000);
  const progressPercent = Math.min((liveProgressMs / playback.track.durationMs) * 100, 100);

  return (
    <div className="rounded-2xl border border-white/8 bg-black/15 p-4">
      <div className="flex items-start gap-4">
        <div className="relative h-16 w-16 overflow-hidden rounded-2xl bg-white/5">
          {playback.track.albumArtUrl ? (
            <Image
              src={playback.track.albumArtUrl}
              alt={playback.track.album}
              fill
              sizes="64px"
              className="object-cover"
            />
          ) : null}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-3">
            <p className="text-sm text-white/40">Spotify</p>
            <span className={playback.isPlaying ? playingBadgeClass : pausedBadgeClass}>
              {playback.isPlaying ? "Playing" : "Paused"}
            </span>
          </div>

          <a
            href={playback.track.externalUrl}
            target="_blank"
            rel="noreferrer"
            className="mt-2 block truncate text-lg font-semibold text-white hover:text-white/80"
          >
            {playback.track.title}
          </a>
          <p className="truncate text-sm text-white/55">{playback.track.artists}</p>
          <p className="truncate text-sm text-white/35">{playback.track.album}</p>
        </div>
      </div>

      <div className="mt-4">
        <div className="h-2 overflow-hidden rounded-full bg-white/8">
          <div className="h-full rounded-full bg-[#1DB954]" style={{ width: `${progressPercent}%` }} />
        </div>
        <div className="mt-2 flex items-center justify-between text-xs uppercase tracking-[0.2em] text-white/35">
          <span>{formatTime(progressSeconds)}</span>
          <span>{formatTime(durationSeconds)}</span>
        </div>
      </div>
    </div>
  );
}

const playingBadgeClass = "rounded-full border border-[#1DB954]/30 bg-[#1DB954]/15 px-2.5 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-[#7ee2a8]";
const pausedBadgeClass = "rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-white/55";