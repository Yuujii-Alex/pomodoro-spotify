import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/auth";

type SpotifyApiTrack = {
  name: string;
  duration_ms: number;
  artists: Array<{ name: string }>;
  album: {
    name: string;
    images: Array<{ url: string }>;
  };
  external_urls: {
    spotify: string;
  };
};

type SpotifyPlaybackResponse = {
  is_playing: boolean;
  progress_ms: number;
  item: SpotifyApiTrack | null;
};

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session?.accessToken) {
    return NextResponse.json({ connected: false });
  }

  const response = await fetch("https://api.spotify.com/v1/me/player/currently-playing", {
    headers: {
      Authorization: `Bearer ${session.accessToken}`,
    },
    cache: "no-store",
  });

  if (response.status === 204) {
    return NextResponse.json({ connected: true, hasTrack: false });
  }

  if (!response.ok) {
    return NextResponse.json({ connected: true, hasTrack: false });
  }

  const playback = (await response.json()) as SpotifyPlaybackResponse;

  if (!playback.item) {
    return NextResponse.json({ connected: true, hasTrack: false });
  }

  return NextResponse.json({
    connected: true,
    hasTrack: true,
    isPlaying: playback.is_playing,
    track: {
      title: playback.item.name,
      artists: playback.item.artists.map((artist) => artist.name).join(", "),
      album: playback.item.album.name,
      albumArtUrl: playback.item.album.images[0]?.url ?? null,
      durationMs: playback.item.duration_ms,
      progressMs: playback.progress_ms ?? 0,
      externalUrl: playback.item.external_urls.spotify,
    },
  });
}