import { useEffect, useRef, useState } from "react";
import css from "./PlaybackProgressBar.module.css"
import sdk from "@/lib/ClientInstance";

interface PlaybackProgressBarProps {
    duration_ms: number;
    position_ms: number;
    is_paused: boolean;
}

const PlaybackProgressBar = ({duration_ms, position_ms, is_paused}: PlaybackProgressBarProps) => {

    const intervalRef = useRef<any>(null);
    const progressBarRef = useRef<HTMLDivElement>(null);
    const [progressBarWidth, setProgressBarWidth] = useState(position_ms / duration_ms * 100 + "%");

    const [clock, setClock] = useState(`
            ${Math.floor(position_ms / (1000 * 60))}:
            ${((position_ms / 1000) % 60).toFixed(0).padStart(2, "0")}
        `);
    const [duration, setDuration] = useState("0:00");
    const [showHover, setShowHover] = useState(false);

    useEffect(() => {
        if (duration_ms === 0) return;

        setDuration(`${Math.floor(duration_ms / (1000 * 60))}:${((duration_ms / 1000) % 60).toFixed(0).padStart(2, "0")}`);
        
        if (!is_paused) {
            intervalRef.current = setInterval(() => {
                setClock((prevClock) => {
                    const clock = prevClock.split(":");
                    const seconds = parseInt(clock[1]) + 1;
                    const minutes = Math.floor((parseInt(clock[0]) + seconds / 60) % 60) ;
                    return minutes + ":" + Math.round(seconds % 60).toString().padStart(2, "0");
                });
                setProgressBarWidth((prevWidth) => {
                    const width = parseFloat(prevWidth.replace("%", ""));
                    return (width + (1 / duration_ms) * 100) + "%";
                });
            }, 1000);
        }
      
          return () => clearInterval(intervalRef.current);
    }, [is_paused, duration_ms])


  const handleProgressBarClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!progressBarRef.current) return;

    // Compute the new width in percentage based on the click position
    const newWidth = computeNewWidth(event, progressBarRef);

    // Update the progress width state
    console.log(newWidth);
    
    setProgressBarWidth(newWidth + "%");
    console.log((newWidth / 100) ,duration_ms);
    
    sdk.player.seekToPosition(Math.round((newWidth / 100) * duration_ms));
    
  };

    const computeNewWidth = (
        event: React.MouseEvent<HTMLDivElement>,
        progressBarRef: React.RefObject<HTMLDivElement>
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
      

    return ( 
        <div className={css.container}>
            <div className={css.timer}>{clock}</div>
            <div className={css.relativeContainer} onMouseEnter={() => setShowHover(true)} onMouseLeave={() => setShowHover(false)}>
                <div ref={progressBarRef} className={css.progressBar} style={{width: progressBarWidth}} onClick={(e) => handleProgressBarClick(e)} ></div>
                {showHover && <div className={css.progressBarHover} style={{left: progressBarWidth}}></div>}
                <div ref={progressBarRef} className={css.emptyProgressBar} onClick={(e) => handleProgressBarClick(e)}></div>
            </div>
            <div className={css.timer}>{duration}</div>
        </div>
     );
}
 
export default PlaybackProgressBar;