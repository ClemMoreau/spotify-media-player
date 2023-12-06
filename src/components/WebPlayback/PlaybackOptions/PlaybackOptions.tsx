import { PiDevices } from "react-icons/pi";
import { HiOutlineQueueList } from "react-icons/hi2";
import {
    IoVolumeMuteOutline,
    IoVolumeLowOutline,
    IoVolumeMediumOutline,
    IoVolumeHighOutline
} from "react-icons/io5";
import css from "./PlaybackOptions.module.css";
import sdk from "@/lib/ClientInstance";
import { useEffect, useRef, useState } from "react";
import { computeNewWidth, handleMouseOver } from "@/utils/playbackProgressBar.utils";
import { Devices } from "@spotify/web-api-ts-sdk";
import DeviceOption from "./DeviceOption/DeviceOption";

interface PlaybackOptionsProps {
    player: Spotify.Player;
}

export const PlaybackOptions = ({ player }: PlaybackOptionsProps) => {
    
    const [volume, setVolume] = useState<number>(0.5);
    const [volumeIcon, setVolumeIcon] = useState<React.ReactNode>(IoVolumeMediumOutline);

    const progressBarRef = useRef<HTMLDivElement>(null);
    const [progressBarWidth, setProgressBarWidth] = useState(volume + "%");
    const [isDragging, setIsDragging] = useState(false);

    const [devices, setDevices] = useState<Devices>();

    useEffect(() => {
        player.getVolume().then(volume => { setProgressBarWidth(volume * 100 + "%"); setVolume(volume); handleVolumeIconChange(volume); });
    }, [player]);


    const handleVolumeIconChange = (volume: number) => {
        let volumeIcon: React.ReactNode;
        switch (true) {
            case volume === 0:
                volumeIcon = <IoVolumeMuteOutline className={css.volumeIcon} size={20} color={"#b3b2b2"} />;
                break;
            case volume < 0.33:
                volumeIcon = <IoVolumeLowOutline className={css.volumeIcon} size={20} color={"#b3b2b2"} />;
                break;
            case volume < 0.66:
                volumeIcon = <IoVolumeMediumOutline className={css.volumeIcon} size={20} color={"#b3b2b2"} />;
                break;
            case volume >= 0.66:
                volumeIcon = <IoVolumeHighOutline className={css.volumeIcon} size={20} color={"#b3b2b2"} />;
                break;
            default:
                volumeIcon = <IoVolumeMediumOutline className={css.volumeIcon} size={20} color={"#b3b2b2"} />;
                break;
        }
        
        setVolumeIcon(volumeIcon);
    };

    const handleProgressBarClick = async (event: React.MouseEvent<HTMLDivElement>) => {
        if (!progressBarRef.current || !isDragging) return;

        // Compute the new width in percentage based on the click position
        let newWidth = computeNewWidth(event, progressBarRef);

        if (newWidth < 0) newWidth = 0;
        else if (newWidth > 100) newWidth = 100;

        setProgressBarWidth(newWidth + "%");
        
        const volume = parseFloat((newWidth / 100).toFixed(2));
        setVolume(volume);
        handleVolumeIconChange(volume);
        await player.setVolume(volume);
    };

    const handleClickDevice = async () => {
        setDevices(await sdk.player.getAvailableDevices());
    };

    const handleClickPlayQueue = async () => {
        console.warn("Not implemented yet");
        
    };

    return (
        <div className={css.container}>
            <div onClick={handleClickPlayQueue}>
                <HiOutlineQueueList className={css.options} size={20} color={"#b3b2b2"} />
                {devices && <DeviceOption currentDevice={devices.devices.filter(device => device.is_active)[0]} availableDevices={devices.devices.filter(device => !device.is_active)}/>}
            </div>
            <div onClick={handleClickDevice}>
                <PiDevices className={css.options} size={20} color={"#b3b2b2"} />
            </div>
            {volumeIcon}
            <div 
                className={css.relativeContainer} 
                onMouseEnter={() => handleMouseOver("Enter", "volumeProgressBar")} 
                onMouseLeave={() => {setIsDragging(false); handleMouseOver("Leave", "volumeProgressBar");}} 
                onMouseDown={() => setIsDragging(true)} 
                onMouseUp={() => setIsDragging(false)} 
                onMouseMove={(e) => handleProgressBarClick(e)}
            >
                <div id="volumeProgressBar" ref={progressBarRef} className={css.progressBar} style={{ width: progressBarWidth }}></div>
                <div id="volumeProgressBarHover" className={css.progressBarHover} style={{ left: progressBarWidth }}></div>
                <div ref={progressBarRef} className={css.emptyProgressBar}></div>
            </div>
        </div>
    );
};

export default PlaybackOptions;