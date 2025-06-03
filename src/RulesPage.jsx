import React, { useState } from 'react';
import './App.css'; // small-btn
import './RulesPage.css';

function RulesPage() {
    const clickSound = new Audio('./sounds/select.mp3');
    const closeSound = new Audio('./sounds/close.mp3');

    const playClickSound = () => {
        clickSound.currentTime = 0;
        clickSound.volume = 0.2;
        clickSound.play();
    };

    const playCloseSound = () => {
        closeSound.currentTime = 0;
        closeSound.volume = 0.2;
        closeSound.play();
    };

    // arr of rule objects (w/ containers for content)
    const rules = [
        {
            title: 'push, pop... transition :D',
            content: (
                <div className="rule-content">
                    <p className="rule-description">your goal is to process input strings and manipulate a stack to either accept or reject them by applying <u>push, pop, and transitions</u>.</p>
                    <p className="rule-description">🧳 <b>push</b>: add a symbol to your stack. the stack grows.</p>
                    <p className="rule-description">⚠️ <b>pop</b>: remove a symbol from the stack. don't pop an empty stack!</p>
                    <p className="rule-description">🌍 <b>transition</b>: move between states based on  your stack and input.</p>
                </div>
            ),
        },
        {
            title: 'PDA recap',
            content: (
                <div className="rule-content">
                    <img src={require('./sprites/pda_info.png')} />
                </div>
            ),
        },
        {
            title: 'what the state?!',
            content: (
                <div className="rule-content">
                    <p>each level presents a new puzzle that gets progressively more complex</p>
                    <p>you'll start with basic string manipulation and stack operations, and later, you'll encounter <u>advanced problems</u> like:</p>
                    <p><b>ε-transitions</b>: these special moves let you jump to another state without consuming any input symbol 🌀</p>
                    <p><b>branching states</b>: some puzzles may have multiple possible paths.<br /><i>choose wisely!</i> 🌿</p>
                </div>
            ),
        },
        {
            title: 'play2win',
            content: (
                <div className="rule-content">
                    <p>win each level by performing the <u>right sequence</u> of push and pop operations</p>
                    <p><b>correctly match the given input string with the expected stack</b></p>
                    <p><b>correct stack?</b> <i>GGs</i><br />ez victory :p ✅</p>
                    <p><b>incorrect operations?</b> <i>game over</i> <br />(but it's OK, u can try again :D)</p>
                </div>
            ),
        },
        {
            title: 'scoring + leaderboards ⚝',
            content: (
                <div className="rule-content">
                    <p><b>the good ol' points system 🏆</b></p>
                    <p>earn points for every correct operation and transition</p>
                    <p>missed or incorrect moves will cost you points... be careful! </p>
                </div>
            ),
        },
    ];

    const handleHome = () => {
        playCloseSound();
        setTimeout(() => {
            window.location.href = '/'; // reload the page + go back to home
        }, 700); // wait 0.7s
    };

    // track the current rule index
    const [currentRuleIndex, setCurrentRuleIndex] = useState(0);

    // moving to next rule
    const handleNext = () => {
        playClickSound();
        if (currentRuleIndex < rules.length - 1) {
            setCurrentRuleIndex(currentRuleIndex + 1);
        }
    };

    // moving to prev rule
    const handlePrev = () => {
        playClickSound();
        if (currentRuleIndex > 0) {
            setCurrentRuleIndex(currentRuleIndex - 1);
        }
    };

    return (
        <div className="rules">
            <button onClick={handleHome} className="close-btn">X</button>

            {/* <h1>game rules</h1> */}

            <div className="rule-container">
                <h2>{rules[currentRuleIndex].title}</h2>
                {rules[currentRuleIndex].content}
            </div>

            <div className="btn-group">
                {currentRuleIndex > 0 && (
                    <button onClick={handlePrev} className="small-btn">◀ prev</button>
                )}
                {currentRuleIndex < rules.length - 1 && (
                    <button onClick={handleNext} className="small-btn">next ▶</button>
                )}
            </div>
        </div>
    );
}

export default RulesPage;