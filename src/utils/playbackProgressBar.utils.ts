const computeNewWidth = (
    event: React.MouseEvent<HTMLDivElement>,
    progressBarRef: React.RefObject<HTMLDivElement>,
): number => {
    if (!progressBarRef.current) return 0;

    const progressBar = progressBarRef.current;

    // Get the total width of the progress bar
    const totalWidth = progressBar.clientWidth;

    // Get the click position relative to the progress bar
    const clickX = event.clientX - progressBar.getBoundingClientRect().left - 6;

    // Ensure the click position is within the bounds of the progress bar
    const clampedClickX = Math.max(0, Math.min(clickX, totalWidth));

    // Compute the new width in percentage
    const newWidthPercentage = (clampedClickX / totalWidth) * 100;

    return newWidthPercentage;
};

const computeNewClock = (prevClock: string): string => {
    const clock = prevClock.split(":");
    const seconds = parseInt(clock[1]) + 1;
    const minutes = Math.floor((parseInt(clock[0]) + seconds / 60) % 60);
    return (
        minutes +
        ":" +
        Math.round(seconds % 60)
            .toString()
            .padStart(2, "0")
    );
};

const handleMouseOver = (eventType: "Enter" | "Leave", id: string) => {
    const progressBarHover = document.getElementById(`${id}Hover`);
    const progressBar = document.getElementById(id);

    if (!progressBarHover || !progressBar) return;

    progressBarHover.style.display = eventType === "Enter" ? "block" : "none";
    progressBar.style.backgroundColor =
        eventType === "Enter" ? "#1DB954" : "#FFFFFF";
};

export { computeNewClock, computeNewWidth, handleMouseOver };
