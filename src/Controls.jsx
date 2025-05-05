import React from 'react';
import './Controls.css';

/**
 * @param {number} props.timer
 * @param {Function} props.resetGame      relance ce même niveau
 * @param {Function} props.onRestart      retourne au sélecteur
 * @param {number} props.matchedPairs
 * @param {number} props.totalPairs
 */
function Controls({ timer, resetGame, onRestart, matchedPairs, totalPairs }) {
  return (
    <div className="controls">
      <div className="buttons">
        <button onClick={resetGame}>Nouvelle Partie</button>
        <button onClick={onRestart}>Changer de Difficulté</button>
      </div>
      <div className="status">
        <div className="timer">⏱️ Temps restant : {timer} s</div>
        <div className="score">⭐ Paires trouvées : {matchedPairs}/{totalPairs}</div>
      </div>
    </div>
  );
}

export default Controls;
