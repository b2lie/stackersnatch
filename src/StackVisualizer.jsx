import React, { useState, useEffect } from 'react';
import './StackVisualizer.css';
import { Center } from '@chakra-ui/react';

function StackVisualizer({ selectedSprite }) {
  const [showLevelInfo, setShowLevelInfo] = useState(false);
  const [showLevelImage, setShowLevelImage] = useState(false);
  const [level, setLevel] = useState(1); // starting at level 1
  const [stack, setStack] = useState([]);
  const [hasStarted, setHasStarted] = useState(false);
  const [time, setTime] = useState(0); // time tracking for each level
  const [currentState, setCurrentState] = useState('q0');
  const [currentLevelImage, setCurrentLevelImage] = useState(require('./sprites/levels/level1.png')); // FSD for 1st level
  const [canProceedToNextLevel, setCanProceedToNextLevel] = useState(false);
  const [isStackValid, setIsStackValid] = useState(false); // stack validation

  const lvl1Stacks = { // L = { 0^n 1^n | n >= 0 }
    q1: (stack) => stack.every((item) => item === '0' || item === 'z0') && stack.includes('0'),
    q2: (stack) => stack.includes('z0') && !stack.includes('0'),
    q3: (stack) => stack.length === 1 && stack[0] === 'z0'
  };

  const lvl2Stacks = { // L = { ww^R | w = (a + b)^+ }
    
  };

  const lvl3Stacks = {

  };

  const handleTransition = () => {
  };

  const pdaLevels = {
    1: { // level 1: 0^n 1^n
      startState: 'q0',
      states: {
        q0: {
          img: 'sprites/levels/level1_q0.png',
          transitions: [
            { expectedInput: '0', expectedStackTop: 'z0', push: '0', nextState: 'q1' }
          ]
        },
        q1: {
          img: 'sprites/levels/level1_q1.png',
          transitions: [
            { expectedInput: '0', expectedStackTop: '', push: '0', nextState: 'q1' },
            { expectedInput: '1', expectedStackTop: '0', pop: true, /* pop if matches T.O.S. */ nextState: 'q2' }
          ]
        },
        q2: {
          img: 'sprites/levels/level1_q2.png',
          transitions: [
            { expectedInput: '1', expectedStackTop: '0', pop: true, nextState: 'q2' },
            { expectedInput: '', expectedStackTop: 'z0', pop: true, nextState: 'q3' }
          ]
        },
        q3: {
          img: 'sprites/levels/level1_q3.png',
          expectedInput: '', expectedStackTop: '' /* empty stack */, accept: true /* final accept state */
        }
      }
    }
  };

  const restartLevel = () => {
    setHasStarted(false); // reset start flag
    // setInputString('');   // clear input
    setStack([]);         // clear stack
    setTime(0);           // reset timer
    setCurrentState('q0');
    setCanProceedToNextLevel(false);
  }

  // const handleNextLevel = () => {
  //   if (result === 'Correct!') {
  //     setLevel((lvl) => lvl + 1);
  //     restartLevel();
  //   }
  // };

  const handlePush = (symbol) => {
    setStack((prevStack) => [...prevStack, symbol]);
  };

  const handlePop = () => {
    if (stack.length > 1) { // prevent popping 'z0'
      setStack((prevStack) => prevStack.slice(0, -1));
    }
  };

  return (
    <div className="stack-visualizer">
      {/* timer + points panel */}
      <div className="left-panel">
        <h2>timer: {time}s</h2>
        <img
          src={selectedSprite?.img || '/chars/char1.png'}
          alt="player"
          style={{ width: '100px', height: '100px', marginTop: '10px' }}
        />
        <p>{selectedSprite?.name || 'charlie'}</p>
      </div>

      {/* levels panel */}
      <div className="middle-panel">
        {!showLevelInfo && (
          <div className="center-button">
            <button onClick={() => setShowLevelInfo(true)}>
              {'round start !'}
            </button>
          </div>
        )}

        {showLevelInfo && (
          <>
            <h2>
              Level {level} - {level === 1 ? '0^n 1^n' : level === 2 ? '(a+b)^n' : 'Palindrome'}
            </h2>
            <img src={currentLevelImage} alt="current level" />
          </>
        )}

        {hasStarted && (
          <>
            <div className="button-row">
              <button>
                validate PDA
              </button>
              <button onClick={restartLevel}>
                stop PDA
              </button>
            </div>
          </>
        )}

        {canProceedToNextLevel && (
          <button>
            next level
          </button>
        )}

        {/* display state we're at currently */}
        {hasStarted && (
          <div>
            <h3>current state: {currentState}</h3>
          </div>
        )}
      </div>

      {/* stack panel */}
      <div className="right-panel">
        <h2>the stack</h2>
        <div className="stack-box">
          {stack.length === 0 ? (
            <p>( empty )</p>
          ) : (
            [...stack].reverse().map((item, index) => ( // pushes items on top of z0
              <div key={index} className="stack-item">
                {item}
              </div>
            ))
          )}
        </div>
        {/* push onto or pop off stack */}
        <button onClick={() => handlePush('0')}>push '0'</button>
        <button onClick={handlePop}>pop</button>
        <button onClick={handleTransition}>transition</button>
      </div>
    </div>
  );
}

export default StackVisualizer;