import React, { useState, useEffect } from 'react';
import './AlarmClock.css';

interface AlarmClockProps {
  isActive: boolean;
}

export const AlarmClock: React.FC<AlarmClockProps> = ({ isActive }) => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [alarmTime, setAlarmTime] = useState('');
  const [isAlarmSet, setIsAlarmSet] = useState(false);
  const [isAlarmRinging, setIsAlarmRinging] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (isAlarmSet && alarmTime) {
      const [hours, minutes] = alarmTime.split(':').map(Number);
      const now = new Date();
      const alarm = new Date();
      alarm.setHours(hours, minutes, 0, 0);
      
      // If alarm time has passed today, set for tomorrow
      if (alarm <= now) {
        alarm.setDate(alarm.getDate() + 1);
      }

      const timeUntilAlarm = alarm.getTime() - now.getTime();
      
      const alarmTimeout = setTimeout(() => {
        setIsAlarmRinging(true);
        setIsAlarmSet(false);
      }, timeUntilAlarm);

      return () => clearTimeout(alarmTimeout);
    }
  }, [isAlarmSet, alarmTime]);

  const handleSetAlarm = () => {
    if (alarmTime) {
      setIsAlarmSet(true);
      setIsAlarmRinging(false);
    }
  };

  const handleStopAlarm = () => {
    setIsAlarmRinging(false);
    setIsAlarmSet(false);
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour12: true,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (!isActive) return null;

  return (
    <div className="alarm-clock" role="main" aria-label="Alarm Clock">
      <div className="clock-display">
        <h1 className="current-time" aria-live="polite">
          {formatTime(currentTime)}
        </h1>
        <p className="current-date" aria-live="polite">
          {formatDate(currentTime)}
        </p>
      </div>

      {isAlarmRinging && (
        <div className="alarm-ringing" role="alert">
          <h2>🔔 ALARM!</h2>
          <button 
            className="stop-alarm-btn"
            onClick={handleStopAlarm}
            aria-label="Stop alarm"
          >
            Stop Alarm
          </button>
        </div>
      )}

      <div className="alarm-controls">
        <h3>Set Alarm</h3>
        <div className="alarm-input-group">
          <label htmlFor="alarm-time">Alarm Time:</label>
          <input
            id="alarm-time"
            type="time"
            value={alarmTime}
            onChange={(e) => setAlarmTime(e.target.value)}
            disabled={isAlarmSet}
            aria-describedby="alarm-status"
          />
        </div>
        
        <div className="alarm-actions">
          {!isAlarmSet ? (
            <button
              className="set-alarm-btn"
              onClick={handleSetAlarm}
              disabled={!alarmTime}
              aria-label="Set alarm"
            >
              Set Alarm
            </button>
          ) : (
            <div className="alarm-set-info">
              <p id="alarm-status" aria-live="polite">
                ⏰ Alarm set for {alarmTime}
              </p>
              <button
                className="cancel-alarm-btn"
                onClick={() => setIsAlarmSet(false)}
                aria-label="Cancel alarm"
              >
                Cancel Alarm
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
