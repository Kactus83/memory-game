import React, { useState } from 'react';
import './App.css';
import MemoryGame from './MemoryGame';
import DifficultySelector from './DifficultySelector';
import { difficulties } from './difficulties';

function App() {
    const [mode, setMode] = useState(null);

    function handleRestart() {
        // Réaffiche le sélecteur de difficulté
        setMode(null);
    }

    return (
        <div className="App">
            {mode === null ? (
                <DifficultySelector onSelect={setMode} />
            ) : (
                <MemoryGame
                    difficulty={difficulties[mode]}
                    onRequestRestart={handleRestart}
                />
            )}
        </div>
    );
}

export default App;
