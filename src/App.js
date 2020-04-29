import React from 'react';
import VideoSource from './assets/video.mp4';
import VideoPlayer from './VideoPlayer';
import PlayerComponent from './Player';

function App() {
  return (
    <div className="App">
      <div>
        {/* <VideoPlayer src={VideoSource} width={600} /> */}
        <PlayerComponent src={VideoSource} />
      </div>
    </div>
  );
}

export default App;
