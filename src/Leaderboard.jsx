import React, { useState, useEffect } from 'react';
import './Leaderboard.css';

function Leaderboard() {
  const [leaderboard, setLeaderboard] = useState([]);

  useEffect(() => {
    const storedLeaderboard = JSON.parse(localStorage.getItem('leaderboard')) || [];
    // Sort entries by score in descending order
    storedLeaderboard.sort((a, b) => b.score - a.score);
    setLeaderboard(storedLeaderboard);
  }, []);

  return (
    <div className="leaderboard">
      <h1>leaderboard</h1>
      <ul>
        {leaderboard.map((entry, index) => (
          <li key={index}>
            &lt; {entry.name} &gt; - {entry.score} points
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Leaderboard;