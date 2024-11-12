import React from 'react';
import './Controls.css';

function Controls({ timer, resetGame, matchedPairs, totalPairs }) {
    return (
        <div className="controls">
            <button onClick={resetGame}>Nouvelle Partie</button>
            <div className="status">
                <div className="timer">⏱️ Temps restant : {timer} s</div>
                <div className="score">⭐ Paires trouvées : {matchedPairs}/{totalPairs}</div>
            </div>
        </div>
    );
}

export default Controls;