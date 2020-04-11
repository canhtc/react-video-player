import React, { useRef, useEffect, useState } from 'react';
import Videojs from 'video.js';
const VideoPlayer = ({ width, sources }) => {
  const refVideo = useRef();
  const refPlayer = useRef();
  const [zoom, setZoom] = useState(1);
  const [rotate, setRotate] = useState(0);

  const [positon, setPositon] = useState({
    top: 0,
    left: 0,
  });

  const handleZooms = (type) => {
    /**
     * @type 0: zoom in; 1: zoom out
     */
    if (type === 0) {
      return setZoom((state) => state + 0.1);
    }
    return setZoom((state) => (state === 1 ? 1 : state - 0.1));
  };

  const handleRotates = (type) => {
    /**
     * @type 0: rotate left; 1: rotate right
     */
    return setRotate((state) => (type === 0 ? state + 5 : state - 5));
  };

  const handleMoves = (type) => {
    /**
     * @type 0: left; 1: right; 2: up; 3:down
     */

    return setPositon((state) => {
      switch (type) {
        case 0: //left
          return {
            ...state,
            left: state.left - 5,
          };

        case 1: //right
          return {
            ...state,
            left: state.left + 5,
          };

        case 2: //up
          return {
            ...state,
            top: state.top - 5,
          };

        case 3: //doun
          return {
            ...state,
            top: state.top + 5,
          };

        default:
          break;
      }
    });
  };
  //Move
  const handleReset = () => {
    setZoom(1);
    setRotate(0);
    setPositon({ left: 0, top: 0 });
  };

  useEffect(() => {
    refPlayer.current = Videojs(refVideo.current, {
      autoplay: true,
      controls: true,
      width: '100%',
      sources,
    });
    return () => {
      if (refPlayer.current) {
        refPlayer.current.dispose();
      }
    };
  }, [sources]);

  return (
    <div className="video-player-component">
      <div className="controler">
        <div className="controls">
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
          <button
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
          </button>
          <button onClick={() => handleReset()} className="button reset">
            reset
          </button>
          <div className="state">
            Zoom:{Math.floor(zoom * 100)}% Rotate : {rotate} Left:{' '}
            {positon && positon.left} Top: {positon && positon.top}
          </div>
        </div>
      </div>
      <div
        style={{
          background: '#333333',
          width: width,
          height: (width * 9) / 16,
          overflow: 'hidden',
          position: 'relative',
        }}
      >
        <div data-vjs-player>
          <video
            style={{
              position: 'absolute',
              top: positon.top,
              left: positon.left,
              transform: `scale(${zoom}) rotate(${rotate}deg)`,
            }}
            ref={refVideo}
            className="video-js vjs-16-9"
          />
        </div>
      </div>
    </div>
  );
};

export default VideoPlayer;
