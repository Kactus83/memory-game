import React, { useState, useEffect } from 'react';
import './MemoryGame.css';

import Card from './Card';
import Controls from './Controls';
import GameOver from './GameOver';

// 25 emojis max
const MASTER_VALUES = [
  '🍎','🍌','🍇','🍉','🍓','🍑','🥝','🍍','🍒','🥭',
  '🍐','🍋','🍊','🥑','🥥','🍅','🍆','🥕','🌽','🍄',
  '🥔','🌶️','🧄','🧅','🥬'
];

function shuffleCards(array) {
  const arr = array.slice();
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function generateInitialCards(values) {
  let id = 1;
  const cards = values.flatMap(value => [
    { id: id++, value, isFlipped: false, isMatched: false },
    { id: id++, value, isFlipped: false, isMatched: false }
  ]);
  return shuffleCards(cards);
}

/**
 * @param {Array}  [props.initialCards]    pour les tests
 * @param {{timer: number, pairs: number}} props.difficulty
 * @param {Function} props.onRequestRestart
 */
function MemoryGame({ initialCards, difficulty, onRequestRestart }) {
  // Génère exactement difficulty.pairs cartes
  const makeCards = () => {
    if (initialCards) {
      return shuffleCards(initialCards);
    }
    const totalCards = difficulty.pairs;
    const valuesNeeded = Math.ceil(totalCards / 2);
    const values = MASTER_VALUES.slice(0, valuesNeeded);
    let cards = generateInitialCards(values);
    // Si on génère plus que besoin (paires impaires), on slice
    return cards.slice(0, totalCards);
  };

  const [cards, setCards] = useState(() => makeCards());
  const [firstCard, setFirstCard] = useState(null);
  const [secondCard, setSecondCard] = useState(null);
  const [disabled, setDisabled] = useState(false);
  const [matchedPairs, setMatchedPairs] = useState(0);
  const [timer, setTimer] = useState(difficulty.timer);
  const [gameOverMessage, setGameOverMessage] = useState('');

  // Nombre de colonnes = racine carrée du nombre de cartes
  const columns = Math.sqrt(cards.length);

  // Countdown
  useEffect(() => {
    if (timer > 0 && !gameOverMessage) {
      const tid = setInterval(() => setTimer(t => t - 1), 1000);
      return () => clearInterval(tid);
    } else if (timer === 0) {
      setGameOverMessage('Temps écoulé ! Vous avez perdu.');
      setDisabled(true);
    }
  }, [timer, gameOverMessage]);

  function handleCardClick(idx) {
    if (disabled || gameOverMessage) return;
    const copy = [...cards];
    const card = copy[idx];
    if (card.isFlipped || card.isMatched) return;
    card.isFlipped = true;
    setCards(copy);
    if (!firstCard) {
      setFirstCard({ ...card, idx });
    } else {
      setSecondCard({ ...card, idx });
      setDisabled(true);
    }
  }

  // Vérification de la paire
  useEffect(() => {
    if (firstCard && secondCard) {
      if (firstCard.value === secondCard.value) {
        setCards(prev =>
          prev.map(c =>
            c.value === firstCard.value
              ? { ...c, isMatched: true }
              : c
          )
        );
        setMatchedPairs(m => m + 1);
        resetTurn();
      } else {
        const to = setTimeout(() => {
          setCards(prev =>
            prev.map(c =>
              c.id === firstCard.id || c.id === secondCard.id
                ? { ...c, isFlipped: false }
                : c
            )
          );
          resetTurn();
        }, 1000);
        return () => clearTimeout(to);
      }
    }
  }, [firstCard, secondCard]);

  // Victoire
  useEffect(() => {
    if (matchedPairs === cards.length / 2 && cards.length > 0) {
      setGameOverMessage('Félicitations, vous avez gagné !');
      setDisabled(true);
    }
  }, [matchedPairs, cards]);

  function resetTurn() {
    setFirstCard(null);
    setSecondCard(null);
    setDisabled(false);
  }

  function resetGame() {
    setCards(makeCards());
    setFirstCard(null);
    setSecondCard(null);
    setMatchedPairs(0);
    setDisabled(false);
    setTimer(difficulty.timer);
    setGameOverMessage('');
  }

  function handleRestartToSelector() {
    onRequestRestart();
  }

  return (
    <div className="memory-game">
      <h1>Jeu de Memory</h1>

      <Controls
        timer={timer}
        resetGame={resetGame}
        onRestart={handleRestartToSelector}
        matchedPairs={matchedPairs}
        totalPairs={cards.length / 2}
      />

      {gameOverMessage && <GameOver message={gameOverMessage} />}

      <div
        className="grid"
        role="grid"
        style={{ gridTemplateColumns: `repeat(${columns}, 100px)` }}
      >
        {cards.map((card, idx) => (
          <Card
            key={card.id}
            card={card}
            onClick={() => handleCardClick(idx)}
          />
        ))}
      </div>
    </div>
  );
}

export default MemoryGame;
