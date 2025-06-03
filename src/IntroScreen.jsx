import React from 'react';
import { useNavigate } from 'react-router-dom';
import './App.css'; // small-btn
import './IntroScreen.css';

const IntroScreen = ({ onStart, onChoosePlayer, onShowRules, onShowLeaderboard }) => {
  return (
    <div className="intro-screen">
      <h1 className="title">stackersnatch</h1>
      <p className="subtitle">pushdown automata stack battle</p>

      <div className="btn-group">
        <button onClick={onStart} className="small-btn">start</button>
        {/* <button onClick={onChoosePlayer} className="small-btn">player select</button> */}
        <button onClick={onShowRules} className="small-btn">rules</button>
        <button onClick={onShowLeaderboard} className="small-btn">leaderboard</button>
      </div>

      <div className="creds">
        <img src={ require('./sprites/creds.png') } />
        <p className="subtitle">art creds: <a href="https://cupnooble.itch.io/sprout-lands-asset-pack" target="_blank">cup noodle</a></p>
      </div>
    </div>
  );
};

export default IntroScreen;
