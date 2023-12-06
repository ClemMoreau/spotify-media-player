import { useState, useEffect } from "react";
import sdk from "@/lib/ClientInstance"
import css from "./WebPlayback.module.css";
import PlaybackInfos from "./PlaybackInfos/PlaybackInfos";
import PlayBackControls from "./PlaybackControls/PlaybackControls";
import PlaybackOptions from "./PlaybackOptions/PlaybackOptions";
import PlaybackProgressBar from "./PlaybackProgressBar/PlaybackProgressBar";

interface WebPlaybackProps {
    token: string;
}

const WebPlayback = ({token}: WebPlaybackProps) => {

    const [player, setPlayer] = useState<Spotify.Player>();
    const [state, setState] = useState<Spotify.PlaybackState>();
    const [currentTrack, setCurrentTrack] = useState<Spotify.Track>();
    const [is_active, setActive] = useState(false);


    useEffect(() => {
        const script = document.createElement("script");
        script.src = "https://sdk.scdn.co/spotify-player.js";
        script.async = true;

        document.body.appendChild(script);

        window.onSpotifyWebPlaybackSDKReady = () => {
            const player = new window.Spotify.Player({
                name: 'Web Playback SDK',
                getOAuthToken: cb => { cb(token); },
                volume: 0.5,
            });
            
            setPlayer(player);
    
            player.addListener('ready', async ({ device_id }: any) => {
                console.debug('Ready with Device ID', device_id);
                await sdk.player.transferPlayback([device_id], true);
                await sdk.player.pausePlayback(device_id);
            });
    
            player.addListener('not_ready', ({ device_id }: any) => {
                console.debug('Device ID has gone offline', device_id);
            });

            player.addListener('player_state_changed', (state => { 
                console.debug("State changed");
                
                if (!state) {
                    return;
                }
        
                setState((prevState) => prevState && prevState.timestamp  > state.timestamp ? prevState : state);
                setCurrentTrack((prevState) => prevState && prevState.id === state.track_window.current_track.id ? prevState : state.track_window.current_track);
            
                player.getCurrentState().then( state => { 
                    (!state)? setActive(false) : setActive(true) 
                });
            
            }));        

            player.connect().then(success => {
                if (success) {
                    console.debug('The Web Playback SDK successfully connected to Spotify!');
                }
            });
        }
    }, []);
        

    return (
        <>
            {is_active && state && player && currentTrack ? 
                <>  
                    <div className={css.playbackInfosContainer}>
                        <PlaybackInfos current_track={currentTrack} />
                    </div>
                    <div className={css.playbackControlsContainer}>
                        <PlayBackControls player={player} is_paused={state.paused} />
                        <PlaybackProgressBar state={state} currentTrack={currentTrack} />
                    </div>
                    <div className={css.playbackOptionsContainer}>
                        <PlaybackOptions player={player} />
                    </div>
                </>
            : 
                <div>Loading...</div>
            }
        </>
      );
}
 
export default WebPlayback;