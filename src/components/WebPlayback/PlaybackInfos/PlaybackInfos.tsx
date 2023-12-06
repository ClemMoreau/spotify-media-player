import css from './PlaybackInfos.module.css';

interface PlaybackInfosProps {
    current_track: Spotify.Track | undefined;
}

const PlaybackInfos = ({current_track}: PlaybackInfosProps) => {
    return ( 
        current_track ? <div className={css.mainWrapper}>
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
    : <div> TODO : Info loader </div>);
}
 
export default PlaybackInfos;