import React, { useState } from 'react';
import './App.css';
import MemoryGame from './MemoryGame';
import DifficultySelector from './DifficultySelector';
import { difficulties } from './difficulties';
import { emojiSets } from './emojiSets';

function App() {
  // null ou { level: 'Normal', setKey: 'Fruits' }
  const [config, setConfig] = useState(null);

  const handleRestart = () => setConfig(null);

  return (
    <div className="App">
      {!config ? (
        <DifficultySelector onSelect={setConfig} />
      ) : (
        <MemoryGame
          difficulty={difficulties[config.level]}
          emojiValues={emojiSets[config.setKey]}
          onRequestRestart={handleRestart}
        />
      )}
    </div>
  );
}

export default App;
