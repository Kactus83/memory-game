import React from 'react';
import './GameOver.css';

function GameOver({ message }) {
    return (
        <div className="game-over">
            <h2>{message}</h2>
        </div>
    );
}

export default GameOver;