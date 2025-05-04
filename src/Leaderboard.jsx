import React from 'react';
import Leaderboard from './Leaderboard'
import './WinPage.css';

const closeSound = new Audio('./sounds/close.mp3');

const playCloseSound = () => {
  closeSound.currentTime = 0;
  closeSound.volume = 0.2;
  closeSound.play();
};

const viewLeaderboard = () => {
  <Leaderboard />
}

const goHome = () => {
  playCloseSound();
  setTimeout(() => {
    window.location.href = '/'; // reload the page + go back to home
  }, 700); // wait 0.7s
}

function WinPage() {
  return (
    <div className="middle-pane">
      <img src={require('./sprites/win.gif')} alt="Win!" />
      <div>
        <h1>You Win!</h1>
        <button onClick={viewLeaderboard}>view leaderboard</button>
        <button onClick={goHome}>return home</button>
      </div>
    </div>
  );
}

export default WinPage;
