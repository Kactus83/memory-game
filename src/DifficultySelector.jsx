import React, { useState } from 'react';
import './DifficultySelector.css';
import { difficulties } from './difficulties';
import { emojiSets } from './emojiSets';

function DifficultySelector({ onSelect }) {
  const [level, setLevel] = useState('');
  const [setKey, setSetKey] = useState('');

  const handleStart = () => {
    if (level && setKey) {
      onSelect({ level, setKey });
    }
  };

  return (
    <div className="difficulty-selector">
      <h2>Choisissez un niveau</h2>
      <div className="buttons">
        {Object.keys(difficulties).map(lv => (
          <button
            key={lv}
            className={lv === level ? 'selected' : ''}
            onClick={() => setLevel(lv)}
          >
            {lv}
          </button>
        ))}
      </div>

      <h2>Choisissez un jeu d’émojis</h2>
      <div className="buttons">
        {Object.keys(emojiSets).map(key => (
          <button
            key={key}
            className={key === setKey ? 'selected' : ''}
            onClick={() => setSetKey(key)}
          >
            {key}
          </button>
        ))}
      </div>

      <button
        className="start-button"
        disabled={!level || !setKey}
        onClick={handleStart}
      >
        Démarrer le jeu
      </button>
    </div>
  );
}

export default DifficultySelector;
