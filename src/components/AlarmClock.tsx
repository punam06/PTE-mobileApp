import React, { useState, useEffect } from 'react';
import { useI18nContext } from '../hooks/useI18n';
import './AlarmClock.css';

interface Alarm {
  id: string;
  time: string;
  label: string;
  isActive: boolean;
  isRinging: boolean;
}

interface AlarmClockProps {
  isActive: boolean;
}

export const AlarmClock: React.FC<AlarmClockProps> = ({ isActive }) => {
  const { t, formatTime: formatTimeI18n, formatDate: formatDateI18n } = useI18nContext();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [alarms, setAlarms] = useState<Alarm[]>([]);
  const [newAlarmTime, setNewAlarmTime] = useState('');
  const [newAlarmLabel, setNewAlarmLabel] = useState('');
  const [activeTimeouts, setActiveTimeouts] = useState<Map<string, NodeJS.Timeout>>(new Map());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    // Clear all existing timeouts
    activeTimeouts.forEach(timeout => clearTimeout(timeout));
    const newTimeouts = new Map<string, NodeJS.Timeout>();

    // Set timeouts for all active alarms
    alarms.forEach(alarm => {
      if (alarm.isActive && alarm.time) {
        const [hours, minutes] = alarm.time.split(':').map(Number);
        const now = new Date();
        const alarmDateTime = new Date();
        alarmDateTime.setHours(hours, minutes, 0, 0);
        
        // If alarm time has passed today, set for tomorrow
        if (alarmDateTime <= now) {
          alarmDateTime.setDate(alarmDateTime.getDate() + 1);
        }

        const timeUntilAlarm = alarmDateTime.getTime() - now.getTime();
        
        const alarmTimeout = setTimeout(() => {
          triggerAlarm(alarm.id);
        }, timeUntilAlarm);

        newTimeouts.set(alarm.id, alarmTimeout);
      }
    });

    setActiveTimeouts(newTimeouts);

    // Cleanup function
    return () => {
      newTimeouts.forEach(timeout => clearTimeout(timeout));
    };
  }, [alarms]);

  const triggerAlarm = (alarmId: string) => {
    setAlarms(prev => prev.map(alarm => 
      alarm.id === alarmId 
        ? { ...alarm, isRinging: true }
        : alarm
    ));
  };

  const addAlarm = () => {
    if (newAlarmTime) {
      const newAlarm: Alarm = {
        id: Date.now().toString(),
        time: newAlarmTime,
        label: newAlarmLabel || `${t('alarm_time')} ${newAlarmTime}`,
        isActive: true,
        isRinging: false
      };
      
      setAlarms(prev => [...prev, newAlarm]);
      setNewAlarmTime('');
      setNewAlarmLabel('');
    }
  };

  const deleteAlarm = (alarmId: string) => {
    setAlarms(prev => prev.filter(alarm => alarm.id !== alarmId));
  };

  const toggleAlarm = (alarmId: string) => {
    setAlarms(prev => prev.map(alarm => 
      alarm.id === alarmId 
        ? { ...alarm, isActive: !alarm.isActive, isRinging: false }
        : alarm
    ));
  };

  const stopAlarm = (alarmId: string) => {
    setAlarms(prev => prev.map(alarm => 
      alarm.id === alarmId 
        ? { ...alarm, isRinging: false }
        : alarm
    ));
  };

  const ringingAlarms = alarms.filter(alarm => alarm.isRinging);

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

      {ringingAlarms.length > 0 && (
        <div className="alarm-ringing" role="alert">
          <div className="finished-content">
            <h2>🔔 {t('times_up')}</h2>
            <div className="finished-animation">🎉</div>
            {ringingAlarms.map(alarm => (
              <div key={alarm.id} className="ringing-alarm-info">
                <p>{alarm.label} - {alarm.time}</p>
                <button 
                  className="stop-alarm-btn"
                  onClick={() => stopAlarm(alarm.id)}
                  aria-label={`${t('stop_alarm')} ${alarm.label}`}
                >
                  {t('stop_alarm')}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="alarm-controls">
        <h3>{t('set_alarm')}</h3>
        
        {/* Add new alarm section */}
        <div className="add-alarm-section">
          <div className="alarm-input-group">
            <label htmlFor="new-alarm-time">{t('alarm_time')}:</label>
            <input
              id="new-alarm-time"
              type="time"
              value={newAlarmTime}
              onChange={(e) => setNewAlarmTime(e.target.value)}
            />
          </div>
          <div className="alarm-input-group">
            <label htmlFor="new-alarm-label">{t('alarm_label')}:</label>
            <input
              id="new-alarm-label"
              type="text"
              value={newAlarmLabel}
              onChange={(e) => setNewAlarmLabel(e.target.value)}
              placeholder={t('alarm_label_placeholder')}
            />
          </div>
          <button
            className="add-alarm-btn"
            onClick={addAlarm}
            disabled={!newAlarmTime}
            aria-label={t('add_alarm')}
          >
            ➕ {t('add_alarm')}
          </button>
        </div>

        {/* Alarms list */}
        <div className="alarms-list">
          <h4>{t('active_alarms')} ({alarms.length})</h4>
          {alarms.length === 0 ? (
            <p className="no-alarms">{t('no_alarms_set')}</p>
          ) : (
            alarms.map(alarm => (
              <div key={alarm.id} className={`alarm-item ${alarm.isActive ? 'active' : 'inactive'}`}>
                <div className="alarm-info">
                  <span className="alarm-time">{alarm.time}</span>
                  <span className="alarm-label">{alarm.label}</span>
                  <span className={`alarm-status ${alarm.isActive ? 'on' : 'off'}`}>
                    {alarm.isActive ? '🟢' : '🔴'} {alarm.isActive ? t('on') : t('off')}
                  </span>
                </div>
                <div className="alarm-actions">
                  <button
                    className="toggle-alarm-btn"
                    onClick={() => toggleAlarm(alarm.id)}
                    aria-label={`${alarm.isActive ? t('disable') : t('enable')} ${alarm.label}`}
                  >
                    {alarm.isActive ? t('disable') : t('enable')}
                  </button>
                  <button
                    className="delete-alarm-btn"
                    onClick={() => deleteAlarm(alarm.id)}
                    aria-label={`${t('delete')} ${alarm.label}`}
                  >
                    🗑️
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
