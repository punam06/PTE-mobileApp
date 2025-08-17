import React, { useState, useEffect } from 'react';
import { useI18nContext } from '../hooks/useI18n';
import './AlarmClock.css';

interface AlarmClockProps {
  isActive: boolean;
}

export const AlarmClock: React.FC<AlarmClockProps> = ({ isActive }) => {
  const { t, formatTime: formatTimeI18n, formatDate: formatDateI18n } = useI18nContext();
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

  if (!isActive) return null;

  return (
    <div className="alarm-clock" role="main" aria-label="Alarm Clock">
      <div className="clock-display">
        <h1 className="current-time" aria-live="polite">
          {formatTimeI18n(currentTime)}
        </h1>
        <p className="current-date" aria-live="polite">
          {formatDateI18n(currentTime)}
        </p>
      </div>

      {isAlarmRinging && (
        <div className="alarm-ringing" role="alert">
          <div className="finished-content">
            <h2>🔔 {t('times_up')}</h2>
            <div className="finished-animation">🎉</div>
          </div>
          <button 
            className="stop-alarm-btn"
            onClick={handleStopAlarm}
            aria-label={t('stop_alarm')}
          >
            {t('stop_alarm')}
          </button>
        </div>
      )}

      <div className="alarm-controls">
        <h3>{t('set_alarm')}</h3>
        <div className="alarm-input-group">
          <label htmlFor="alarm-time">{t('alarm_time')}:</label>
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
              aria-label={t('set_alarm')}
            >
              {t('set_alarm')}
            </button>
          ) : (
            <div className="alarm-set-info">
              <p id="alarm-status" aria-live="polite">
                ⏰ {t('alarm_set_for')} {alarmTime}
              </p>
              <button
                className="cancel-alarm-btn"
                onClick={() => setIsAlarmSet(false)}
                aria-label={t('cancel_alarm')}
              >
                {t('cancel_alarm')}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
