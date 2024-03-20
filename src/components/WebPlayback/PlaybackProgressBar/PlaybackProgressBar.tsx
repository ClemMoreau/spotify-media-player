import React from "react";
import { useEffect, useRef, useState } from "react";
import css from "./PlaybackProgressBar.module.css";
import sdk from "@/lib/ClientInstance";
import {
    computeNewClock,
    computeNewWidth,
    handleMouseOver,
} from "@/utils/playbackProgressBar.utils";

interface PlaybackProgressBarProps {
    state: Spotify.PlaybackState;
    currentTrack: Spotify.Track;
}

const PlaybackProgressBar = ({
    state,
    currentTrack,
}: PlaybackProgressBarProps) => {
    const intervalRef = useRef<any>(null);
    const progressBarRef = useRef<HTMLDivElement>(null);

    const [clock, setClock] = useState("0:00");
    const [duration, setDuration] = useState("0:00");
    const [progressBarWidth, setProgressBarWidth] = useState("0%");
    const [isDragging, setIsDragging] = useState(false);

    useEffect(() => {
        if (currentTrack.duration_ms === 0) return;

        if (!state.paused) {
            intervalRef.current = setInterval(() => {
                setClock((prevClock) => computeNewClock(prevClock));
                setProgressBarWidth(
                    (prevWidth) =>
                        parseFloat(prevWidth.replace("%", "")) +
                        (1 / currentTrack.duration_ms) * 100 * 1000 +
                        "%",
                );
            }, 1000);
        }
        return () => clearInterval(intervalRef.current);
    }, [state]);

    useEffect(() => {
        setDuration(
            `${Math.floor(currentTrack.duration_ms / (1000 * 60))}:${(
                (currentTrack.duration_ms / 1000) %
                60
            )
                .toFixed(0)
                .padStart(2, "0")}`,
        );
        setClock(
            `${Math.floor(state.position / (1000 * 60))}:${(
                (state.position / 1000) %
                60
            )
                .toFixed(0)
                .padStart(2, "0")}`,
        );
        setProgressBarWidth(
            `${(state.position / currentTrack.duration_ms) * 100}%`,
        );
    }, [currentTrack]);

    const handleProgressBarClick = async (
        event: React.MouseEvent<HTMLDivElement>,
    ) => {
        if (!progressBarRef.current || !isDragging) return;

        // Compute the new width in percentage based on the click position
        let newWidth = computeNewWidth(event, progressBarRef);

        if (newWidth < 0) newWidth = 0;
        else if (newWidth > 100) newWidth = 100;

        // Update the progress width state
        const position = Math.round(
            (newWidth / 100) * currentTrack.duration_ms,
        );

        setProgressBarWidth(newWidth + "%");
        setClock(
            `${Math.floor(position / (1000 * 60))}:${((position / 1000) % 60)
                .toFixed(0)
                .padStart(2, "0")}`,
        );
        await sdk.player.seekToPosition(position);
    };

    return (
        <div className={css.container}>
            <div className={css.timer}>{clock}</div>
            <div
                className={css.relativeContainer}
                onMouseEnter={() =>
                    handleMouseOver("Enter", "playbackProgressBar")
                }
                onMouseLeave={() => {
                    setIsDragging(false);
                    handleMouseOver("Leave", "playbackProgressBar");
                }}
                onMouseDown={() => setIsDragging(true)}
                onMouseUp={() => setIsDragging(false)}
                onMouseMove={(e) => handleProgressBarClick(e)}
            >
                <div
                    id="playbackProgressBar"
                    ref={progressBarRef}
                    className={css.progressBar}
                    style={{ width: progressBarWidth }}
                ></div>
                <div
                    id="playbackProgressBarHover"
                    className={css.progressBarHover}
                    style={{ left: progressBarWidth }}
                ></div>
                <div
                    ref={progressBarRef}
                    className={css.emptyProgressBar}
                ></div>
            </div>
            <div className={css.timer}>{duration}</div>
        </div>
    );
};

export default PlaybackProgressBar;
