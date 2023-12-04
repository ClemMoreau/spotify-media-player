import { useState, useEffect } from "react";
import sdk from "@/lib/ClientInstance"
import css from "./WebPlayback.module.css";
import PlaybackInfos from "./PlaybackInfos/PlaybackInfos";
import PlayBackControls from "./PlaybackControls/PlaybackControls";
import PlaybackOptions from "./PlaybackOptions/PlaybackOptions";
import PlaybackProgressBar from "./PlaybackProgressBar/PlaybackProgressBar";

export interface Track {
    name: string;
    album: {
        images: [
            { url: string }
        ]
    };
    artists: [
        { name: string }
    ];
    duration_ms: number;
    position_ms: number;

}

const TRACK : Track = {
    name: "",
    album: {
        images: [
            { url: "" }
        ]
    },
    artists: [
        { name: "" }
    ],
    duration_ms: 0,
    position_ms: 0,
}


interface WebPlaybackProps {
    token: string;
}

const WebPlayback = ({token}: WebPlaybackProps) => {

    const [player, setPlayer] = useState<Spotify.Player>({} as Spotify.Player);
    const [is_paused, setPaused] = useState(false);
    const [is_active, setActive] = useState(false);
    const [current_track, setTrack] = useState(TRACK);


    useEffect(() => {
        const script = document.createElement("script");
        script.src = "https://sdk.scdn.co/spotify-player.js";
        script.async = true;

        document.body.appendChild(script);

        window.onSpotifyWebPlaybackSDKReady = () => {
            const player = new window.Spotify.Player({
                name: 'Web Playback SDK',
                getOAuthToken: cb => { cb(token); },
                volume: 0.5
            });
            
            setPlayer(player);
    
            player.addListener('ready', async ({ device_id }: any) => {
                console.log('Ready with Device ID', device_id);
                await sdk.player.transferPlayback([device_id], true);
            });
    
            player.addListener('not_ready', ({ device_id }: any) => {
                console.log('Device ID has gone offline', device_id);
            });

            player.addListener('player_state_changed', (state => { 
                console.log("State changed !", state);
                              
                if (!state) {
                    return;
                }
            
                setTrack({...state.track_window.current_track, duration_ms: state.duration, position_ms: state.position} as unknown as Track);
                setPaused(state.paused);
            
                
                player.getCurrentState().then( state => { 
                    (!state)? setActive(false) : setActive(true) 
                });
            
            }));        

            player.connect().then(success => {
                if (success) {
                    console.log('The Web Playback SDK successfully connected to Spotify!');
                }
            });
        }
    }, []);
        

    return (
        <>
            {is_active ? 
                <>  
                    <div className={css.playbackInfosContainer}>
                        <PlaybackInfos current_track={current_track} />
                    </div>
                    <div className={css.playbackControlsContainer}>
                        <PlayBackControls player={player} is_paused={is_paused} />
                        <PlaybackProgressBar 
                            duration_ms={current_track.duration_ms} 
                            position_ms={current_track.position_ms} 
                            is_paused={is_paused}
                        />
                    </div>
                    <div className={css.playbackOptionsContainer}>
                        <PlaybackOptions />
                    </div>
                </>
            : 
                <div>Loading...</div>
            }
        </>
      );
}
 
export default WebPlayback;