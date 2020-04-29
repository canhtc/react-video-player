import React, { useRef, useEffect, useState } from 'react';
import './index.scss';
import classNames from 'classnames';
const VideoPlayer = ({ src, width }) => {
  const refVideo = useRef();
  const refFullScreen = useRef();
  const [zoom, setZoom] = useState(1);
  // const [rotate, setRotate] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [positon, setPositon] = useState({
    top: 0,
    left: 0,
  });

  useEffect(() => {
    document.addEventListener('fullscreenchange', () => {
      setIsFullscreen(!!(document.fullScreen || document.fullscreenElement));
    });
    document.addEventListener('webkitfullscreenchange', () => {
      setIsFullscreen(!!document.webkitIsFullScreen);
    });
    document.addEventListener('mozfullscreenchange', () => {
      setIsFullscreen(!!document.mozFullScreen);
    });
    document.addEventListener('msfullscreenchange', () => {
      setIsFullscreen(!!document.msFullscreenElement);
    });
  }, []);

  var handleFullscreen = function () {
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
      setIsFullscreen(false);
    } else {
      if (refFullScreen.current.requestFullscreen)
        refFullScreen.current.requestFullscreen();
      else if (refFullScreen.current.mozRequestFullScreen)
        refFullScreen.current.mozRequestFullScreen();
      else if (refFullScreen.current.webkitRequestFullScreen) {
        refVideo.current.webkitRequestFullScreen();
      } else if (refFullScreen.current.msRequestFullscreen)
        refFullScreen.current.msRequestFullscreen();
      setIsFullscreen(true);
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
      const DISTANCE = 10;
      if (zoom === 1) {
        return state;
      }
      switch (type) {
        case 0: //left
          return {
            ...state,
            left: state.left - DISTANCE,
          };

        case 1: //right
          return {
            ...state,
            left: state.left + DISTANCE,
          };

        case 2: //up
          return {
            ...state,
            top: state.top - DISTANCE,
          };

        case 3: //down
          return {
            ...state,
            top: state.top + DISTANCE,
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
    <div className="video-player-component">
      <figure
        ref={refFullScreen}
        className={classNames({
          fullscreen: isFullscreen,
          no_fullscreen: !isFullscreen,
        })}
        style={{
          width: isFullscreen ? '100%' : width,
          height: isFullscreen ? '100%' : (width * 9) / 16,
        }}
      >
        <video
          style={{
            position: 'absolute',
            width: isFullscreen ? '100%' : width,
            height: isFullscreen ? '100%' : (width * 9) / 16,
            top: positon.top,
            left: positon.left,
            transform: `scale(${zoom})`,
            // transform: `scale(${zoom}) rotate(${rotate}deg)`,
          }}
          muted
          id="video"
          preload="metadata"
          ref={refVideo}
          autoPlay
        >
          <source src={src} type="video/mp4" />
        </video>
        <div id="video-controls" className="controls" data-state="visible">
          <button id="playpause" type="button" data-state="play">
            Play/Pause
          </button>
          <button id="stop" type="button" data-state="stop">
            Stop
          </button>
          <div className="progress">
            <progress id="progress" value="0" min="0">
              <span id="progress-bar"></span>
            </progress>
          </div>
          <button id="mute" type="button" data-state="mute">
            Mute/Unmute
          </button>
          <button id="volinc" type="button" data-state="volup">
            Vol+
          </button>
          <button id="voldec" type="button" data-state="voldown">
            Vol-
          </button>
          <button
            onClick={() => handleFullscreen()}
            id="fs"
            type="button"
            className={classNames({
              cancel_fullscreen: isFullscreen,
              go_fullscreen: !isFullscreen,
            })}
          >
            Fullscreen
          </button>
        </div>
        <div className="directional">
          <button onClick={() => handleZooms(0)} className="button zoomin">
            +
          </button>
          <button onClick={() => handleZooms(1)} className="button zoomout">
            -
          </button>
          <button onClick={() => handleMoves(0)} className="button left">
            ⇠
          </button>
          <button onClick={() => handleMoves(1)} className="button right">
            ⇢
          </button>
          <button onClick={() => handleMoves(2)} className="button up">
            ⇡
          </button>
          <button onClick={() => handleMoves(3)} className="button down">
            ⇣
          </button>
          {/* <button
            onClick={() => handleRotates(0)}
            className="button rotateleft"
          >
            &#x21bb;
          </button>
          <button
            onClick={() => handleRotates(1)}
            className="button rotateright"
          >
            &#x21ba;
          </button> */}
          <button onClick={() => handleReset()} className="button reset">
            reset
          </button>
          <div className="state">
            Zoom:{Math.floor(zoom * 100)}% Left: {positon && positon.left} Top:{' '}
            {positon && positon.top}
          </div>
        </div>
      </figure>
    </div>
  );
};

export default VideoPlayer;
