import React, { useState, useEffect } from 'react';
import './Leaderboard.css';

function Leaderboard() {
  const [leaderboard, setLeaderboard] = useState([]);

  useEffect(() => {
    const storedLeaderboard = JSON.parse(localStorage.getItem('leaderboard')) || [];
    
    // filtering out entries with empty names or scores of 0
    const validLeaderboard = storedLeaderboard.filter(
      entry => entry.name.trim() && entry.score > 0
    );

    // sorting valid entries by score in descending order
    validLeaderboard.sort((a, b) => b.score - a.score);

    // clean leaderboard to state
    setLeaderboard(validLeaderboard);
  }, []);

  return (
    <div className="leaderboard">
      <h1>leaderboard</h1>
      <ul>
        {leaderboard.length > 0 ? (
          leaderboard.map((entry, index) => (
            <li key={index}>
              &lt; {entry.name} &gt; - {entry.score} points
            </li>
          ))
        ) : (
          <li>no valid scores yet!</li>
        )}
      </ul>
    </div>
  );
}

export default Leaderboard;