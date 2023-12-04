import { Track } from "../WebPlayback";
import css from './PlaybackInfos.module.css';

interface PlaybackInfosProps {
    current_track: Track;
}

const PlaybackInfos = ({current_track}: PlaybackInfosProps) => {
    return ( 
        <div className={css.mainWrapper}>
            <img src={current_track.album.images[0].url} 
                className={css.nowPlayingCover} alt="" />

            <div className={css.nowPlayingSide}>
                <div className={css.nowPlayingName}>
                    {current_track.name}
                </div>
                <div className={css.nowPlayingArtist}>
                    {current_track.artists[0].name}
                </div>
            </div>
        </div> 
    );
}
 
export default PlaybackInfos;