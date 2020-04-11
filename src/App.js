import React from 'react';
import Video from './assets/video.mp4';
import VideoPlayer from './VideoPlayer';

function App() {
  return (
    <div className="App">
      <div>
        <VideoPlayer
          width={700}
          sources={[
            {
              src: Video,
              type: 'video/mp4',
            },
          ]}
        />
      </div>
    </div>
  );
}

export default App;
