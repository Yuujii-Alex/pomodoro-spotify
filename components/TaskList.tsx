
'use client'

import { FormEvent, useState } from "react";

type Task = {
    id: string;
    title: string;
    completed: boolean;
};



export default function TaskList() {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [draft, setDraft] = useState('');

    const openTasks = tasks.filter((task) => !task.completed);
    const completedTasks = tasks.filter((task) => task.completed);
    const orderedTasks = [...openTasks, ...completedTasks];

    function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        const title = draft.trim();
        if (!title) {
            return;
        }

        setTasks((current) => [
            { id: crypto.randomUUID(), title, completed: false },
            ...current,
        ]);
        setDraft('');
    }

    function toggleTask(taskId: string) {
        setTasks((current) =>
            current.map((task) =>
                task.id === taskId ? { ...task, completed: !task.completed } : task
            )
        );
    }

    return (
        <section className="w-full rounded-4xl border border-white/10 bg-[#181818] p-6 text-left text-white shadow-[0_24px_80px_rgba(0,0,0,0.35)] sm:p-8">
            <div className="flex items-start justify-between gap-4">
                <div>
                    <p className="text-sm uppercase tracking-[0.24em] text-white/40">Task list</p>
                </div>
                <div className="px-4 text-sm text-white/60">
                    {openTasks.length} open / {completedTasks.length} done
                </div>
            </div>

            <form className="mt-6 flex flex-col gap-3 sm:flex-row" onSubmit={handleSubmit}>
                <input
                    value={draft}
                    onChange={(event) => setDraft(event.target.value)}
                    placeholder="Add a task for this session"
                    className="flex-1 rounded-full border border-white/10 bg-black/20 px-5 py-2 text-base text-white outline-none placeholder:text-white/35 focus:border-white/30"
                />
                <button
                    type="submit"
                    className="rounded-full bg-white px-5 py-2 text-base font-semibold text-black transition hover:bg-white/90"
                >
                    Add task
                </button>
            </form>

            <div className="mt-6 space-y-3">
                {orderedTasks.map((task) => (
                    <button
                        key={task.id}
                        type="button"
                        onClick={() => toggleTask(task.id)}
                        className={task.completed ? completedTaskClass : activeTaskClass}
                    >
                        <span className={task.completed ? completedMarkerClass : taskMarkerClass}>
                            {task.completed ? 'Done' : 'Open'}
                        </span>
                        <span className="flex-1">{task.title}</span>
                        <span className="text-xs uppercase tracking-[0.24em] text-white/35">
                            {task.completed ? 'Completed' : 'In focus'}
                        </span>
                    </button>
                ))}

                {orderedTasks.length === 0 ? (
                    <div className="rounded-3xl border border-dashed border-white/10 bg-black/15 px-5 py-8 text-center text-white/45">
                        Add a task to give the next Pomodoro a clear target.
                    </div>
                ) : null}
            </div>
        </section>
    )
}

const activeTaskClass = "flex w-full items-center gap-4 rounded-3xl border border-white/10 bg-[#111111] px-4 py-4 text-left text-white transition hover:border-white/20 hover:bg-white/[0.06]";
const completedTaskClass = "flex w-full items-center gap-4 rounded-3xl border border-white/8 bg-black/20 px-4 py-4 text-left text-white/45 transition hover:border-white/15 hover:bg-white/[0.04]";
const taskMarkerClass = "rounded-full border border-white/15 bg-white px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-black";
const completedMarkerClass = "rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-white/55";