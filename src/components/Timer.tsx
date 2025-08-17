import React, { useState, useEffect, useRef } from 'react';
import './Timer.css';

interface TimerProps {
  isActive: boolean;
}

export const Timer: React.FC<TimerProps> = ({ isActive }) => {
  const [time, setTime] = useState(0);
  const [initialTime, setInitialTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [customMinutes, setCustomMinutes] = useState('');
  const [customSeconds, setCustomSeconds] = useState('');
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const presetTimes = [
    { label: '1 min', seconds: 60 },
    { label: '5 min', seconds: 300 },
    { label: '10 min', seconds: 600 },
    { label: '15 min', seconds: 900 },
    { label: '20 min', seconds: 1200 },
    { label: '30 min', seconds: 1800 },
  ];

  useEffect(() => {
    if (isRunning && time > 0) {
      intervalRef.current = setInterval(() => {
        setTime(prevTime => {
          if (prevTime <= 1) {
            setIsRunning(false);
            setIsFinished(true);
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, time]);

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (hours > 0) {
      return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handlePresetSelect = (seconds: number) => {
    if (!isRunning) {
      setTime(seconds);
      setInitialTime(seconds);
      setIsFinished(false);
    }
  };

  const handleCustomTimer = () => {
    const minutes = parseInt(customMinutes) || 0;
    const seconds = parseInt(customSeconds) || 0;
    const totalSeconds = minutes * 60 + seconds;
    
    if (totalSeconds > 0 && !isRunning) {
      setTime(totalSeconds);
      setInitialTime(totalSeconds);
      setIsFinished(false);
      setCustomMinutes('');
      setCustomSeconds('');
    }
  };

  const handleStart = () => {
    if (time > 0) {
      setIsRunning(true);
      setIsFinished(false);
    }
  };

  const handlePause = () => {
    setIsRunning(false);
  };

  const handleReset = () => {
    setIsRunning(false);
    setTime(initialTime);
    setIsFinished(false);
  };

  const handleStop = () => {
    setIsRunning(false);
    setTime(0);
    setInitialTime(0);
    setIsFinished(false);
  };

  const getProgress = () => {
    if (initialTime === 0) return 0;
    return ((initialTime - time) / initialTime) * 100;
  };

  const dismissFinished = () => {
    setIsFinished(false);
  };

  if (!isActive) return null;

  return (
    <div className="timer" role="main" aria-label="Countdown Timer">
      {isFinished && (
        <div className="timer-finished" role="alert">
          <h2>⏰ Time's Up!</h2>
          <p>Your timer has finished</p>
          <button 
            className="dismiss-btn"
            onClick={dismissFinished}
            aria-label="Dismiss timer finished notification"
          >
            Dismiss
          </button>
        </div>
      )}

      <div className="timer-display">
        <h1 className="time-display" aria-live="polite">
          {formatTime(time)}
        </h1>
        
        {initialTime > 0 && (
          <div className="progress-container">
            <div 
              className="progress-bar"
              style={{ width: `${getProgress()}%` }}
              aria-label={`Timer progress: ${Math.round(getProgress())}% complete`}
            />
          </div>
        )}
        
        <div className="status-indicator" aria-live="polite">
          {isRunning ? (
            <span className="running">⏱️ Running</span>
          ) : time > 0 ? (
            <span className="paused">⏸️ Paused</span>
          ) : (
            <span className="ready">⏱️ Set Timer</span>
          )}
        </div>
      </div>

      {time === 0 && (
        <div className="timer-setup">
          <h3>Quick Presets</h3>
          <div className="preset-buttons">
            {presetTimes.map((preset) => (
              <button
                key={preset.seconds}
                className="preset-btn"
                onClick={() => handlePresetSelect(preset.seconds)}
                aria-label={`Set timer for ${preset.label}`}
              >
                {preset.label}
              </button>
            ))}
          </div>

          <div className="custom-timer">
            <h4>Custom Timer</h4>
            <div className="custom-inputs">
              <div className="input-group">
                <label htmlFor="minutes">Minutes:</label>
                <input
                  id="minutes"
                  type="number"
                  min="0"
                  max="59"
                  value={customMinutes}
                  onChange={(e) => setCustomMinutes(e.target.value)}
                  placeholder="0"
                  aria-describedby="custom-timer-help"
                />
              </div>
              <div className="input-group">
                <label htmlFor="seconds">Seconds:</label>
                <input
                  id="seconds"
                  type="number"
                  min="0"
                  max="59"
                  value={customSeconds}
                  onChange={(e) => setCustomSeconds(e.target.value)}
                  placeholder="0"
                  aria-describedby="custom-timer-help"
                />
              </div>
            </div>
            <button
              className="set-custom-btn"
              onClick={handleCustomTimer}
              disabled={!customMinutes && !customSeconds}
              aria-label="Set custom timer"
            >
              Set Timer
            </button>
            <p id="custom-timer-help" className="help-text">
              Enter minutes and/or seconds for a custom timer
            </p>
          </div>
        </div>
      )}

      {time > 0 && (
        <div className="timer-controls">
          <div className="main-controls">
            {!isRunning ? (
              <button
                className="start-btn"
                onClick={handleStart}
                aria-label="Start timer"
              >
                Start
              </button>
            ) : (
              <button
                className="pause-btn"
                onClick={handlePause}
                aria-label="Pause timer"
              >
                Pause
              </button>
            )}
            
            <button
              className="reset-btn"
              onClick={handleReset}
              aria-label="Reset timer to initial time"
            >
              Reset
            </button>
            
            <button
              className="stop-btn"
              onClick={handleStop}
              aria-label="Stop and clear timer"
            >
              Stop
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
