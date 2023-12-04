import { CgPlayTrackPrev, CgPlayTrackNext } from "react-icons/cg";
import { FaCirclePlay, FaCirclePause } from "react-icons/fa6";
import { FaRandom } from "react-icons/fa";
import { SlLoop } from "react-icons/sl";
import css from "./PlaybackControls.module.css"

interface PlayBackControlsProps {
    player: Spotify.Player;
    is_paused: boolean;
}


const PlayBackControls = ({player, is_paused} : PlayBackControlsProps) => {

    return ( 
        <div className={css.btnSpotify}>
            <div className={css.btnSpotifyRandom} onClick={() => { console.warn("Random not implemented !") }} >
                <FaRandom size={16} color={"#b3b2b2"} />
            </div>

            <div className={css.btnSpotifyPrev} onClick={() => { player.previousTrack() }} >
                <CgPlayTrackPrev size={32} color={"#b3b2b2"} />
            </div>

            <div className={css.btnSpotifyPlay} onClick={() => { player.togglePlay() }} >
                { is_paused ? <FaCirclePlay size={32} color={"#ffffff"} /> : <FaCirclePause size={32} color={"#ffffff"} /> }
            </div>

            <div className={css.btnSpotifyNext} onClick={() => { player.nextTrack() }} >
                <CgPlayTrackNext size={32} color={"#b3b2b2"} />
            </div>

            <div className={css.btnSpotifyLoop} onClick={() => { console.warn("Loop not implemented !") }} >
                <SlLoop size={16} color={"#b3b2b2"} />
            </div>
        </div> 
    );
}
 
export default PlayBackControls;