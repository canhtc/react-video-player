import React, { useState, useEffect, Fragment, useRef } from 'react';
import './index.scss';
import SettingsIcon from '../assets/icons/player/settings.svg';
import PlayArrowIcon from '../assets/icons/player/play_arrow.svg';
import ReplayIcon from '../assets/icons/player/replay.svg';
import PauseIcon from '../assets/icons/player/pause.svg';
import VolumeUpIcon from '../assets/icons/player/volume_up.svg';
import VolumeOffIcon from '../assets/icons/player/volume_off.svg';
import DownloadIcon from '../assets/icons/player/download.svg';
import FullscreenIcon from '../assets/icons/player/full.png';
import ClassNames from 'classnames';
import DurationComponent from '../Duration';

const speeds = [
  {
    value: 0.5,
    title: '0.5x',
  },
  {
    value: 1,
    title: '1.0x',
  },
  {
    value: 1.5,
    title: '1.5x',
  },
  {
    value: 2,
    title: '2.0x',
  },
];

const PlayerComponent = ({ src }) => {
  const refVideo = useRef();
  const progress = useRef();

  const refInterval = useRef();
  const [video, setVideo] = useState({
    playbackRate: 1.0,
    url: null,
    playing: false,
    volume: 0.5,
    muted: false,
    played: 0,
    loaded: 0,
    duration: 0,
    ended: false,
    seeking: false,
  });
  useEffect(() => {
    if (video && video.volume && refVideo.current) {
      refVideo.current.volume = video.volume;
    }
  }, [src, video]);

  useEffect(() => {
    if (refVideo.current) {
      refInterval.current = setInterval(() => {
        const videoTime = refVideo.current.currentTime;
        return setVideo((state) => ({
          ...state,
          played: parseFloat(videoTime / video.duration),
        }));
      }, 1000 / video.playbackRate);
    }
    return () => clearInterval(refInterval.current);
  });

  const handlePlay = () => {
    // console.log('onPlay');
    refVideo.current.play();
    return setVideo((state) => ({ ...state, playing: true, ended: false }));
  };

  const handlePause = () => {
    // console.log('handlePause');
    refVideo.current.pause();
    return setVideo((state) => ({ ...state, playing: false }));
  };

  const handleEnded = () => {
    // console.log('onEnded');
    return setVideo((state) => ({ ...state, ended: true, playing: false }));
  };

  const handleDuration = () => {
    let duration = refVideo.current.duration;
    return setVideo((state) => ({
      ...state,
      duration,
    }));
  };

  const handleSeekMouseDown = (event) => {
    // console.log('handleSeekMouseDown', event);
    return setVideo((state) => ({
      ...state,
      seeking: true,
    }));
  };

  const handleSeekMouseUp = (event) => {
    setVideo((state) => ({
      ...state,
      seeking: false,
    }));
    const jumpTime =
      (event.nativeEvent.offsetX / progress.current.offsetWidth) *
      video.duration;
    // set current time to seek time
    refVideo.current.currentTime = jumpTime;
  };

  const handleSeekChange = (event) => {
    event.persist();
    return setVideo((state) => ({
      ...state,
      played: parseFloat(
        event.nativeEvent.offsetX / progress.current.offsetWidth
      ),
    }));
  };
  const handleMuteChange = () => {
    return setVideo((state) => {
      let muted = !state.muted;
      refVideo.current.muted = muted;
      return {
        ...state,
        muted,
      };
    });
  };
  const handleVolumeChange = (e) => {
    e.persist();
    return setVideo((state) => ({
      ...state,
      volume: parseFloat(e.target.value),
    }));
  };

  return (
    <div className="player-component">
      <div className="player">
        <figure>
          <video
            ref={refVideo}
            className="player-video viewer"
            onDurationChange={handleDuration}
            onEnded={handleEnded}
            width="100%"
            height="100%"
          >
            <source src={src} type="video/mp4" />
          </video>
        </figure>

        <div
          className="top-player-component"
          style={{ transform: 'translateY(0)' }}
        >
          <div className="left"></div>
          <div className="right">
            <button className="settings">
              <img src={SettingsIcon} alt="" />
            </button>
          </div>
        </div>
        <div
          className="bottom-player-component"
          style={{ transform: 'translateY(0)' }}
        >
          {video && video.playing ? (
            <div>
              <button onClick={() => handlePause()} className="play">
                <img src={PauseIcon} alt="" />
              </button>
            </div>
          ) : video.ended ? (
            <div>
              <button onClick={() => handlePlay()} className="play">
                <img src={ReplayIcon} alt="" />
              </button>
            </div>
          ) : (
            <div>
              <button onClick={() => handlePlay()} className="play">
                <img src={PlayArrowIcon} alt="" />
              </button>
            </div>
          )}

          <div
            onClick={handleSeekChange}
            onMouseUp={handleSeekMouseUp}
            onMouseDown={handleSeekMouseDown}
            ref={progress}
            className="progress"
          >
            <div
              className="progress-filled"
              style={{
                flexBasis: `${video.played * 100}%`,
              }}
            />
            <div
              className="point"
              style={{ marginLeft: `${video.played * 100}%` }}
            >
              <div className="timer">
                <button className="timing">
                  <DurationComponent
                    seconds={video && video.played * video.duration}
                  />
                </button>
              </div>
            </div>
          </div>
          <div>
            <button className="time">
              <DurationComponent seconds={video.duration} />
            </button>
          </div>

          <div className="volume">
            <button onClick={handleMuteChange}>
              <img
                src={video && video.muted ? VolumeOffIcon : VolumeUpIcon}
                alt=""
              />
            </button>
            <div className="volume-scrub">
              <input
                type="range"
                min={0}
                max={1}
                step="any"
                orient="vertical"
                name="volume"
                className="volume-slider"
                value={video.volume}
                onChange={handleVolumeChange}
              />
            </div>
          </div>
          <div className="speed">
            <button>
              {
                speeds.filter((speed) => speed.value === video.playbackRate)[0]
                  .title
              }
            </button>
            <div className="speeds">
              {speeds.map((q) => (
                <Fragment>
                  <button
                    className={ClassNames({
                      selected: q.value === video.playbackRate,
                    })}
                    key={q.value}
                    onClick={() =>
                      setVideo((state) => ({
                        ...state,
                        playbackRate: q.value,
                      }))
                    }
                  >
                    {q.title}
                  </button>
                  <br />
                </Fragment>
              ))}
            </div>
          </div>
          <div className="download">
            <button>
              <a href={src} download>
                <img src={DownloadIcon} alt="" width="35px" />
              </a>
            </button>
          </div>
          <div className="expand">
            <button className="fullscreen">
              <img src={FullscreenIcon} alt="" width="35px" />
            </button>
            <button className="reduce" style={{ display: 'none' }}>
              <img src={FullscreenIcon} alt="" width="35px" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlayerComponent;