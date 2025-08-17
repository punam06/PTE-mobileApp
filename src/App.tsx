import React from 'react';
import { useOrientation, getFeatureFromOrientation } from './hooks/useOrientation';
import { AlarmClock } from './components/AlarmClock';
import { Stopwatch } from './components/Stopwatch';
import { Timer } from './components/Timer';
import { Weather } from './components/Weather';
import './App.css';

function App() {
  const orientation = useOrientation();
  const currentFeature = getFeatureFromOrientation(orientation);

  return (
    <div className="App" data-orientation={orientation} data-feature={currentFeature}>
      {/* Orientation indicator for debugging/development */}
      <div className="orientation-debug" aria-live="polite">
        <span>🧭 {orientation} → {currentFeature}</span>
      </div>

      {/* Feature Components */}
      <AlarmClock isActive={currentFeature === 'alarm'} />
      <Stopwatch isActive={currentFeature === 'stopwatch'} />
      <Timer isActive={currentFeature === 'timer'} />
      <Weather isActive={currentFeature === 'weather'} />

      {/* Instructions overlay for first-time users */}
      <div className="instructions-overlay" role="banner">
        <div className="instructions-content">
          <h3>📱 Rotate your device to switch features!</h3>
          <div className="feature-list">
            <div className="feature-item">
              <span className="icon">📱↑</span>
              <span>Portrait Up → Alarm Clock</span>
            </div>
            <div className="feature-item">
              <span className="icon">📱→</span>
              <span>Landscape → Stopwatch</span>
            </div>
            <div className="feature-item">
              <span className="icon">📱↓</span>
              <span>Portrait Down → Timer</span>
            </div>
            <div className="feature-item">
              <span className="icon">📱←</span>
              <span>Landscape Left → Weather</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
