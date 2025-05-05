import React from 'react';
import './DifficultySelector.css';
import { difficulties } from './difficulties';

function DifficultySelector({ onSelect }) {
  return (
    <div className="difficulty-selector">
      <h2>Choisissez un niveau</h2>
      <div className="buttons">
        {Object.keys(difficulties).map(level => (
          <button
            key={level}
            className="difficulty-button"
            onClick={() => onSelect(level)}
          >
            {level}
          </button>
        ))}
      </div>
    </div>
  );
}

export default DifficultySelector;
