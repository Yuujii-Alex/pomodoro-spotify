'use client'

import { signIn, signOut, useSession } from "next-auth/react";

export function LoginBtn() {
  const { data: session } = useSession();

  if (session) {
    return <button onClick={() => signOut()}>Sign out</button>;
  }

  return <button onClick={() => signIn("spotify")} className="inline-flex items-center justify-center rounded-full bg-[#1DB954] px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/90">Connect Spotify</button>;
}