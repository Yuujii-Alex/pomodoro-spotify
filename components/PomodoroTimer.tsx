'use client'

import { SpotifyNowPlaying } from "@/components/SpotifyNowPlaying";
import { DURATIONS } from "@/lib/constants";
import { formatTime } from "@/lib/util";
import { TimerMode } from "@/types/types";
import { useEffect, useState } from "react";


export function PomodoroTimer() {
  const [mode, setMode] = useState<TimerMode>('pomodoro');
  const [timeLeft, setTimeLeft] = useState(DURATIONS.pomodoro);
  const [isRunning, setIsRunning] = useState(false);
  const [activeControl, setActiveControl] = useState<"start" | "pause" | "reset">("pause");
  const [completedSessions, setCompletedSessions] = useState(0);

  useEffect(() => {
    if (!isRunning) {
      return;
    }

    const intervalId = window.setInterval(() => {
      setTimeLeft((prev: number) => {
        if (prev <= 1) {
          window.clearInterval(intervalId);
          setIsRunning(false);
          setActiveControl("pause");

          if (mode === 'pomodoro') {
            setCompletedSessions((current) => current + 1);
          }

          // pause spotify playback here
          return 0;
        }

        return prev - 1;
      });
    }, 1000);

    return () => window.clearInterval(intervalId);
  }, [isRunning, mode]);

  function handleStart() {
    if (timeLeft === 0) {
      setTimeLeft(DURATIONS[mode]);
    }

    setIsRunning(true);
    setActiveControl("start");
  }

  function handlePause() {
    setIsRunning(false);
    setActiveControl("pause");
  }

  function handleReset() {
    setIsRunning(false);
    setTimeLeft(DURATIONS[mode]);
    setActiveControl("reset");
  }

  function handleModeChange(newMode: TimerMode) {
    setIsRunning(false);
    setMode(newMode);
    setTimeLeft(DURATIONS[newMode]);
    setActiveControl("pause");
  }

  return (
    <section className="w-full max-w-lg rounded-4xl border border-white/10 bg-[#181818] p-6 text-white shadow-[0_24px_80px_rgba(0,0,0,0.35)] sm:p-8">
      <div className="grid grid-cols-3 gap-2 rounded-2xl bg-black/20 p-1.5">
        <button
          className={mode === 'pomodoro' ? activeModeClass : inactiveModeClass}
          onClick={() => handleModeChange('pomodoro')}
        >
          Pomodoro
        </button>
        <button
          className={mode === 'shortBreak' ? activeModeClass : inactiveModeClass}
          onClick={() => handleModeChange('shortBreak')}
        >
          Short Break
        </button>
        <button
          className={mode === 'longBreak' ? activeModeClass : inactiveModeClass}
          onClick={() => handleModeChange('longBreak')}
        >
          Long Break
        </button>
      </div>
        <p className="text-sm text-white/40">sessions {completedSessions}</p>

      <div className="mt-2 rounded-[28px] border border-white/8 bg-[#111111] px-6 py-10 text-center sm:px-8 sm:py-12">
        <p className="text-sm uppercase tracking-[0.24em] text-white/40">Time left</p>
        <h1 className="mt-5 text-7xl font-semibold tracking-tight text-white sm:text-[7rem]">
          {formatTime(timeLeft)}
        </h1>
        <p className="mt-5 text-sm text-white/50">
          Spotify pauses automatically when this session ends.
        </p>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <button
            className={activeControl === "start" ? activeControlButtonClass : inactiveControlButtonClass}
            onClick={handleStart}
          >
            Start
          </button>
          <button
            className={activeControl === "pause" ? activeControlButtonClass : inactiveControlButtonClass}
            onClick={handlePause}
          >
            Pause
          </button>
          <button
            className={activeControl === "reset" ? activeControlButtonClass : inactiveControlButtonClass}
            onClick={handleReset}
          >
            Reset
          </button>
        </div>
      </div>

      <div className="mt-5 space-y-3 text-left">
        <SpotifyNowPlaying />
      </div>
    </section>
  );
}

const activeModeClass =
  "rounded-xl bg-white px-4 py-3 text-sm font-semibold text-black transition hover:bg-white/90";

const inactiveModeClass =
  "rounded-xl px-4 py-3 text-sm font-medium text-white/60 transition hover:bg-white/5 hover:text-white";

const inactiveControlButtonClass = "flex-1 rounded-full border border-white/10 px-5 py-3.5 text-base font-medium text-white/75 transition hover:bg-white/5";
const activeControlButtonClass = "flex-1 rounded-full bg-white px-5 py-3.5 text-base font-semibold text-black transition hover:bg-white/90";