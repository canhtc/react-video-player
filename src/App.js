import React from 'react';
import VideoSource from './assets/video.mp4';
import PlayerComponent from './Player';

function App() {
  return (
    <div className="App">
      <div style={{ width: 300 }}>
        <PlayerComponent src={VideoSource} />
      </div>
    </div>
  );
}

export default App;
