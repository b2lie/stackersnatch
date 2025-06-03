import { useState, useEffect } from 'react';
import './Leaderboard.css';

function Leaderboard() {
  const [leaderboard, setLeaderboard] = useState([]);
  const [showSuccess, setShowSuccess] = useState(false);
    const closeSound = new Audio('./sounds/close.mp3');

    const playCloseSound = () => {
        closeSound.currentTime = 0;
        closeSound.volume = 0.2;
        closeSound.play();
    };

  useEffect(() => {
    const storedLeaderboard = JSON.parse(localStorage.getItem('leaderboard')) || [];

    if (storedLeaderboard.length === 0) {
      const sampleEntries = [
        { name: '(╯°□°）╯︵STACK', score: 120 },
        { name: 'stack_wizard', score: 90 },
        { name: '🧃pda_g0d', score: 75 },
        { name: '🌀q0_stomper', score: 60 },
        { name: 'q3.exe', score: 45 },
      ];

      localStorage.setItem('leaderboard', JSON.stringify(sampleEntries));
      setLeaderboard(sampleEntries);
    } else {
      const validLeaderboard = storedLeaderboard.filter(
        entry => entry.name.trim() && entry.score > 0
      );
      validLeaderboard.sort((a, b) => b.score - a.score);
      setLeaderboard(validLeaderboard);
    }
  }, []);

  const clearLeaderboard = () => {
    localStorage.removeItem('leaderboard');
    setLeaderboard([]);
    setShowSuccess(true);

    setTimeout(() => setShowSuccess(false), 3000);
  };

  const handleHome = () => {
    playCloseSound();
    setTimeout(() => {
      window.location.href = '/'; // reload the page + go back to home
    }, 700); // wait 0.7s
  };

  return (
    <div className="leaderboard-wrapper">
      <button onClick={handleHome} className="close-btn">X</button>
      <div className="leaderboard-box">
        <h2 className="leaderboard-title">🏆 leaderboard</h2>

        {leaderboard.length > 0 ? (
          <ul className="leaderboard-list">
            {leaderboard.map((entry, index) => (
              <li key={index}>
                <span className="rank">#{index + 1}</span> &lt; {entry.name} &gt; — <span className="score">{entry.score}</span> pts
              </li>
            ))}
          </ul>
        ) : !showSuccess && (
          <p className="no-entries">no entries yet 🕸️</p>
        )}

        <button className="clear-btn" onClick={clearLeaderboard}>🧹 clear leaderboard</button>

        {showSuccess && (
          <div className="alert success">
            <span className="alert-close" onClick={() => setShowSuccess(false)}>❌</span>
            <span className="alert-text">🚮 leaderboard cleared successfully!</span>
          </div>
        )}
      </div>
    </div>
  );
}

export default Leaderboard;