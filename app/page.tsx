import { LoginBtn } from "@/components/LoginBtn";
import { PomodoroTimer } from "@/components/PomodoroTimer";
import TaskList from "@/components/TaskList";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#121212] px-6 py-8 text-white sm:px-10 lg:px-16">
      <section className="mx-auto flex min-h-[calc(100vh-5rem)] max-w-5xl flex-col">
        <header className="flex flex-col gap-3 border-b border-white/8 pb-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.24em] text-white/40">
              Pomodoro + Spotify (only works with premium accounts)
            </p>
            <h1 className="mt-3 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
              Focus sessions that end by pausing playback.
            </h1>
            <p className="py-2 text-sm text-white/55">
              No alarm sound. Spotify pauses when time is up.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:items-end">
            
            <LoginBtn />
          </div>
        </header>

        <div className="flex flex-1 items-center justify-center py-12 sm:py-16">
          <div className="grid w-full gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(320px,0.9fr)] lg:items-start">
            <PomodoroTimer />
            <TaskList />
          </div>
        </div>
      </section>
    </main>
  );
}
