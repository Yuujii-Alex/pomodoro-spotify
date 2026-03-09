
export function formatTime(seconds: number) {
    const minutes = Math.floor(seconds/60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
}

export function startTimer(duration: number, onTick: (timeLeft: number) => void, onComplete: () => void) {
    let timeLeft = duration;
    onTick(timeLeft);
    const intervalId = setInterval(() => {
        timeLeft -= 1;
        onTick(timeLeft);
        if (timeLeft <= 0) {
            clearInterval(intervalId);
            onComplete();
        }
    }, 1000);
    return () => clearInterval(intervalId); // Return a function to stop the timer
}

export function pauseTimer(stopTimer: () => void) {
    stopTimer();
}