import React, { useState, useEffect } from 'react';
import './App.css';

const App = () => {
  const morningSchedule = [
    { time: '10:20~11:05', part: 'Listening' },
    { time: '11:05~11:15', part: 'Part5' },
    { time: '11:15~11:25', part: 'Part6' },
    { time: '11:25~12:20', part: 'Part7' },
  ];

  const afternoonSchedule = [
    { time: '15:00~15:45', part: 'Listening' },
    { time: '15:45~15:55', part: 'Part5' },
    { time: '15:55~16:05', part: 'Part6' },
    { time: '16:05~17:00', part: 'Part7' },
  ];

  const [isMorning, setIsMorning] = useState(true);
  const [currentPart, setCurrentPart] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [hour, setHour] = useState(10);
  const [minute, setMinute] = useState(20);
  const [second, setSecond] = useState(0);
  const [selectedSession, setSelectedSession] = useState('morning'); // 選択されたセッションを管理

  const schedule = isMorning ? morningSchedule : afternoonSchedule;

  const handleToggleSession = (session) => {
    if (session === 'morning') {
      setIsMorning(true);
      setHour(10);
      setMinute(20);
      setSecond(0);
    } else {
      setIsMorning(false);
      setHour(15);
      setMinute(0);
      setSecond(0);
    }
    setSelectedSession(session); // 選択されたセッションを更新
    setIsPlaying(false);
    setCurrentPart(0);
  };

  const skipPart = (direction) => {
    if (direction === 'next' && currentPart < schedule.length - 1) {
      setCurrentPart(currentPart + 1);
    } else if (direction === 'prev' && currentPart > 0) {
      setCurrentPart(currentPart - 1);
    }
  };

  useEffect(() => {
    const [startHour, startMinute] = schedule[currentPart].time
      .split('~')[0]
      .split(':')
      .map(Number);
    setHour(startHour);
    setMinute(startMinute);
    setSecond(0);
  }, [currentPart]);

  useEffect(() => {
    let interval;
    if (isPlaying) {
      interval = setInterval(() => {
        setSecond((prev) => {
          if (prev === 59) {
            setMinute((m) => {
              if (m === 59) {
                setHour((h) => (h === 23 ? 0 : h + 1));
                return 0;
              }
              return m + 1;
            });
            return 0;
          }
          return prev + 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying]);

  return (
    <div className="app">
      <header className="header">
        {/* アイコン画像を表示 */}
        <div className='header_icon'></div>
      </header>
      <div className="container">
        <aside className="sidebar">
          <button
            className={selectedSession === 'morning' ? 'selected' : ''}
            onClick={() => handleToggleSession('morning')}
          >
            午前実施
          </button>
          <button
            className={selectedSession === 'afternoon' ? 'selected' : ''}
            onClick={() => handleToggleSession('afternoon')}
          >
            午後実施
          </button>
        </aside>
        <main className="main">

          <div className="clock">
            <div className="clock-face">
              {[...Array(12)].map((_, i) => (
                <div
                  key={i}
                  className="clock-number"
                  style={{
                    transform: `rotate(${i * 30}deg) translate(0, -130px)`,
                  }}
                >
                  {i === 0 ? 12 : i}
                </div>
              ))}
              <div
                className="hour-hand"
                style={{
                  transform: `rotate(${hour * 30 + minute * 0.5}deg)`,
                }}
              ></div>
              <div
                className="minute-hand"
                style={{
                  transform: `rotate(${minute * 6}deg)`,
                }}
              ></div>
              <div
                className="second-hand"
                style={{
                  transform: `rotate(${second * 6}deg)`,
                }}
              ></div>
            </div>
          </div>
        </main>
        <footer className="footer">
        <div className="schedule-list">
            {schedule.map((item, index) => (
              <div
                key={index}
                className={`schedule-item ${index === currentPart ? 'active' : ''}`}
                onClick={() => setCurrentPart(index)}
              >
                <span className="schedule-time">{item.time}</span>
                <span className="schedule-part">  {item.part}</span>
              </div>
            ))}
          </div>
          <div className='Playbutton'>
          <button onClick={() => skipPart('prev')}>&laquo;</button>
          <button onClick={() => setIsPlaying(!isPlaying)}>
            {isPlaying ? '⏸' : '▶'}
          </button>
          <button onClick={() => skipPart('next')}>&raquo;</button>
          </div>
        </footer>
      </div>
      <div className="copyright">
      <p>&copy; 2024 Kyosuke_ii All Rights Reserved.</p>
    </div>
    </div>
  );
};

export default App;
