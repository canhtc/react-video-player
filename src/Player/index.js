import React, { useState, useEffect, Fragment, useRef } from 'react';
import './index.scss';
import ControlIcon from '../assets/icons/player/control_camera.svg';
import PlayArrowIcon from '../assets/icons/player/play_arrow.svg';
import ReplayIcon from '../assets/icons/player/replay.svg';
import PauseIcon from '../assets/icons/player/pause.svg';
import VolumeUpIcon from '../assets/icons/player/volume_up.svg';
import VolumeOffIcon from '../assets/icons/player/volume_off.svg';
import DownloadIcon from '../assets/icons/player/download.svg';
import FullscreenIcon from '../assets/icons/player/fullscreen.svg';
import ExitFullscreenIcon from '../assets/icons/player/fullscreen_exit.svg';
import ClassNames from 'classnames';
import DurationComponent from '../Duration';
// Control icons
import ZoomInIcon from '../assets/icons/player/zoom_in.svg';
import ZoomOutIcon from '../assets/icons/player/zoom_out.svg';
import ResetIcon from '../assets/icons/player/refresh.svg';
import ArrowLeftIcon from '../assets/icons/player/arrow_back.svg';
import ArrowRightIcon from '../assets/icons/player/arrow_forward.svg';
import ArrowTopIcon from '../assets/icons/player/arrow_upward.svg';
import ArrowBottomIcon from '../assets/icons/player/arrow_downward.svg';

// Control icons

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

const PlayerComponent = ({ src, poster }) => {
  const progress = useRef();
  const refVideo = useRef();
  const refFullScreen = useRef();
  const refInterval = useRef();
  const [video, setVideo] = useState({
    controls: false,
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
    fullscreen: false,
  });

  const [zoom, setZoom] = useState(1);
  const [positon, setPositon] = useState({
    top: 0,
    left: 0,
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

  const handleSpeedChange = (playbackRate) => {
    refVideo.current.playbackRate = playbackRate;
    return setVideo((state) => ({
      ...state,
      playbackRate,
    }));
  };
  const handleControlsChange = () => {
    return setVideo((state) => ({
      ...state,
      controls: !state.controls,
    }));
  };
  const handleFullscreen = () => {
    // If fullscreen mode is active...
    if (
      !!(
        document.fullScreen ||
        document.webkitIsFullScreen ||
        document.mozFullScreen ||
        document.msFullscreenElement ||
        document.fullscreenElement
      )
    ) {
      // ...exit fullscreen mode
      // (Note: this can only be called on document)
      if (document.exitFullscreen) document.exitFullscreen();
      else if (document.mozCancelFullScreen) document.mozCancelFullScreen();
      else if (document.webkitCancelFullScreen)
        document.webkitCancelFullScreen();
      else if (document.msExitFullscreen) document.msExitFullscreen();
      setVideo((state) => ({
        ...state,
        fullscreen: false,
      }));
    } else {
      if (refFullScreen.current.requestFullscreen)
        refFullScreen.current.requestFullscreen();
      else if (refFullScreen.current.mozRequestFullScreen)
        refFullScreen.current.mozRequestFullScreen();
      else if (refFullScreen.current.webkitRequestFullScreen) {
        refVideo.current.webkitRequestFullScreen();
      } else if (refFullScreen.current.msRequestFullscreen)
        refFullScreen.current.msRequestFullscreen();
      setVideo((state) => ({
        ...state,
        fullscreen: true,
      }));
    }
  };

  const handleZooms = (type) => {
    const DISTANCE = 0.2;
    /**
     * @type 0: zoom in; 1: zoom out
     */
    if (type === 0) {
      return setZoom((state) => state + DISTANCE);
    }
    return setZoom((state) => (state === 1 ? 1 : state - DISTANCE));
  };

  // const handleRotates = (type) => {
  //   /**
  //    * @type 0: rotate left; 1: rotate right
  //    */
  //   return setRotate((state) => (type === 0 ? state + 5 : state - 5));
  // };

  const handleMoves = (type) => {
    /**
     * @type 0: left; 1: right; 2: up; 3:down
     */

    return setPositon((state) => {
      const DISTANCE = 20;
      if (zoom === 1) {
        return state;
      }
      switch (type) {
        case 0: //left
          return {
            ...state,
            left: state.left + DISTANCE,
          };

        case 1: //right
          return {
            ...state,
            left: state.left - DISTANCE,
          };

        case 2: //up
          return {
            ...state,
            top: state.top + DISTANCE,
          };

        case 3: //down
          return {
            ...state,
            top: state.top - DISTANCE,
          };

        default:
          break;
      }
    });
  };
  //Move
  const handleReset = () => {
    setZoom(1);
    // setRotate(0);
    setPositon({ left: 0, top: 0 });
  };

  return (
    <div className="player-component">
      <figure ref={refFullScreen}>
        <video
          poster={poster}
          ref={refVideo}
          className="player-video viewer"
          onDurationChange={handleDuration}
          onEnded={handleEnded}
          style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            top: positon.top,
            left: positon.left,
            transform: `scale(${zoom})`,
            // transform: `scale(${zoom}) rotate(${rotate}deg)`,
          }}
        >
          <source src={src} type="video/mp4" />
        </video>
        {video && video.controls && (
          <div className="controls-video">
            <div className="title">
              <button>Video Controller</button>
            </div>
            <div className="move-buttons">
              <div />
              <button onClick={() => handleMoves(2)}>
                <img src={ArrowTopIcon} alt="" />
              </button>
              <div />
              <button onClick={() => handleMoves(0)}>
                <img src={ArrowLeftIcon} alt="" />
              </button>
              <button onClick={() => handleReset()}>
                <img src={ResetIcon} alt="" />
              </button>
              <button onClick={() => handleMoves(1)}>
                <img src={ArrowRightIcon} alt="" />
              </button>
              <div />
              <button onClick={() => handleMoves(3)}>
                <img src={ArrowBottomIcon} alt="" />
              </button>
              <div />
            </div>
            <div className="zoom-buttons">
              <button onClick={() => handleZooms(0)}>
                <img src={ZoomInIcon} alt="" />
              </button>
              <button onClick={() => handleZooms(1)}>
                <img src={ZoomOutIcon} alt="" />
              </button>
              <div className="information">
                <button>
                  <div className="zoom">{`${Math.floor(zoom * 100)}%`}</div>
                </button>
              </div>
            </div>
          </div>
        )}
        <div className="top-player-component">
          <div className="control">
            <button onClick={handleControlsChange} className="settings">
              <img src={ControlIcon} alt="" />
            </button>
          </div>
        </div>
        <div className="bottom-player-component">
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
                <Fragment key={q.value}>
                  <button
                    className={ClassNames({
                      selected: q.value === video.playbackRate,
                    })}
                    key={q.value}
                    onClick={() => handleSpeedChange(q.value)}
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
            <button onClick={() => handleFullscreen()} className="fullscreen">
              {video.fullscreen ? (
                <img src={ExitFullscreenIcon} alt="" />
              ) : (
                <img src={FullscreenIcon} alt="" />
              )}
            </button>
          </div>
        </div>
      </figure>
    </div>
  );
};

export default PlayerComponent;
