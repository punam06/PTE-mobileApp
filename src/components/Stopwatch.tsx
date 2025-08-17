import React, { useState, useEffect, useRef } from 'react';
import './Stopwatch.css';

interface StopwatchProps {
  isActive: boolean;
}

export const Stopwatch: React.FC<StopwatchProps> = ({ isActive }) => {
  const [time, setTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [laps, setLaps] = useState<number[]>([]);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setTime(prevTime => prevTime + 10);
      }, 10);
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
  }, [isRunning]);

  const formatTime = (milliseconds: number) => {
    const totalMs = milliseconds;
    const minutes = Math.floor(totalMs / 60000);
    const seconds = Math.floor((totalMs % 60000) / 1000);
    const ms = Math.floor((totalMs % 1000) / 10);

    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}.${ms.toString().padStart(2, '0')}`;
  };

  const handleStart = () => {
    setIsRunning(true);
  };

  const handleStop = () => {
    setIsRunning(false);
  };

  const handleReset = () => {
    setTime(0);
    setIsRunning(false);
    setLaps([]);
  };

  const handleLap = () => {
    if (isRunning) {
      setLaps(prevLaps => [...prevLaps, time]);
    }
  };

  const getBestLap = () => {
    if (laps.length === 0) return null;
    return Math.min(...laps);
  };

  const getWorstLap = () => {
    if (laps.length === 0) return null;
    return Math.max(...laps);
  };

  if (!isActive) return null;

  return (
    <div className="stopwatch" role="main" aria-label="Stopwatch">
      <div className="stopwatch-display">
        <h1 className="time-display" aria-live="polite">
          {formatTime(time)}
        </h1>
        
        <div className="status-indicator" aria-live="polite">
          {isRunning ? (
            <span className="running">⏱️ Running</span>
          ) : time > 0 ? (
            <span className="paused">⏸️ Paused</span>
          ) : (
            <span className="ready">⏱️ Ready</span>
          )}
        </div>
      </div>

      <div className="stopwatch-controls">
        <div className="main-controls">
          {!isRunning ? (
            <button
              className="start-btn"
              onClick={time === 0 ? handleStart : handleStart}
              aria-label={time === 0 ? "Start stopwatch" : "Resume stopwatch"}
            >
              {time === 0 ? 'Start' : 'Resume'}
            </button>
          ) : (
            <button
              className="stop-btn"
              onClick={handleStop}
              aria-label="Stop stopwatch"
            >
              Stop
            </button>
          )}
          
          <button
            className="reset-btn"
            onClick={handleReset}
            disabled={time === 0 && laps.length === 0}
            aria-label="Reset stopwatch"
          >
            Reset
          </button>
        </div>

        {isRunning && (
          <button
            className="lap-btn"
            onClick={handleLap}
            aria-label="Record lap time"
          >
            Lap
          </button>
        )}
      </div>

      {laps.length > 0 && (
        <div className="laps-section" aria-label="Lap times">
          <h3>Lap Times</h3>
          <div className="laps-stats">
            {getBestLap() !== null && (
              <p className="best-lap">
                🏆 Best: {formatTime(getBestLap()!)}
              </p>
            )}
            {getWorstLap() !== null && getBestLap() !== getWorstLap() && (
              <p className="worst-lap">
                🐌 Worst: {formatTime(getWorstLap()!)}
              </p>
            )}
          </div>
          <div className="laps-list">
            {laps.map((lapTime, index) => {
              const isBeest = lapTime === getBestLap();
              const isWorst = lapTime === getWorstLap() && getBestLap() !== getWorstLap();
              
              return (
                <div 
                  key={index} 
                  className={`lap-item ${isBeest ? 'best' : ''} ${isWorst ? 'worst' : ''}`}
                >
                  <span className="lap-number">Lap {index + 1}</span>
                  <span className="lap-time">{formatTime(lapTime)}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
