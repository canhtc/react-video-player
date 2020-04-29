import React, { useState, useEffect } from 'react';
import VideoSource from './assets/video.mp4';
import PlayerComponent from './Player';

function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 3000);
  }, []);

  return (
    <div className="App">
      <div style={{ width: 600 }}>
        <PlayerComponent src={VideoSource} loading={loading} />
      </div>
    </div>
  );
}

export default App;
