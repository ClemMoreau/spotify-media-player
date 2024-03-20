import React from "react";
import { CgPlayTrackPrev, CgPlayTrackNext } from "react-icons/cg";
import { FaCirclePlay, FaCirclePause } from "react-icons/fa6";
import { FaRandom } from "react-icons/fa";
import { SlLoop } from "react-icons/sl";
import sdk from "@/lib/ClientInstance";
import css from "./PlaybackControls.module.css";
import { useEffect, useState } from "react";

interface PlayBackControlsProps {
    player: Spotify.Player | undefined;
    is_paused: boolean;
}

const PlayBackControls = ({ player, is_paused }: PlayBackControlsProps) => {
    const [isShuffle, setShuffle] = useState(false);
    const [isRepeat, setRepeat] = useState<"off" | "context" | "track">("off");

    useEffect(() => {
        initPlaybackState();
    }, [sdk]);

    const initPlaybackState = async () => {
        const state = await sdk.player.getPlaybackState();
        if (!state) return;

        setShuffle(state.shuffle_state);
        setRepeat(state.repeat_state as "track" | "context" | "off");
    };

    const handleShuffle = async () => {
        await sdk.player.togglePlaybackShuffle(!isShuffle);
        setShuffle(!isShuffle);
    };

    const handleRepeat = async () => {
        let reportMode = "";
        switch (isRepeat) {
            case "off":
                reportMode = "context";
                break;
            case "context":
                reportMode = "track";
                break;
            case "track":
                reportMode = "off";
                break;
            default:
                break;
        }

        await sdk.player.setRepeatMode(
            reportMode as "track" | "context" | "off",
        );
        setRepeat(reportMode as "track" | "context" | "off");
    };

    return player ? (
        <div className={css.btnSpotify}>
            <div className={css.btnSpotifyRandom} onClick={handleShuffle}>
                <FaRandom size={16} color={isShuffle ? "#1DB954" : "#b3b2b2"} />
            </div>

            <div
                className={css.btnSpotifyPrev}
                onClick={() => {
                    player.previousTrack();
                }}
            >
                <CgPlayTrackPrev size={32} color={"#b3b2b2"} />
            </div>

            <div
                className={css.btnSpotifyPlay}
                onClick={() => {
                    player.togglePlay();
                }}
            >
                {is_paused ? (
                    <FaCirclePlay size={32} color={"#ffffff"} />
                ) : (
                    <FaCirclePause size={32} color={"#ffffff"} />
                )}
            </div>

            <div
                className={css.btnSpotifyNext}
                onClick={async () => {
                    await player.nextTrack();
                    await player.pause();
                }}
            >
                <CgPlayTrackNext size={32} color={"#b3b2b2"} />
            </div>

            <div className={css.btnSpotifyLoop} onClick={handleRepeat}>
                <SlLoop
                    size={16}
                    color={
                        isRepeat === "off"
                            ? "#b3b2b2"
                            : isRepeat === "context"
                              ? "#FFFFFF"
                              : "#1DB954"
                    }
                />
            </div>
        </div>
    ) : (
        <div> TODO : Controls loader </div>
    );
};

export default PlayBackControls;
