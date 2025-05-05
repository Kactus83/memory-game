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

// Mélange Fisher–Yates
function shuffleCards(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// Duplique chaque valeur pour créer des paires
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
  // Génère exactement difficulty.pairs cartes, ajoute une carte Joker si impair
  const makeCards = () => {
    if (initialCards) {
      return shuffleCards(initialCards);
    }
    const totalCards = difficulty.pairs;
    const pairCount = Math.floor(totalCards / 2);
    const values = MASTER_VALUES.slice(0, pairCount);
    let cards = generateInitialCards(values);

    if (totalCards % 2 === 1) {
      // on ajoute une carte Joker unique
      const maxId = cards.reduce((max, c) => Math.max(max, c.id), 0);
      cards.push({
        id: maxId + 1,
        value: '🃏',
        isFlipped: false,
        isMatched: false,
        isJoker: true
      });
    }

    return shuffleCards(cards);
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
  const totalPairs = Math.floor(cards.length / 2);

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

    // Joker : on le retourne et on ne lance pas la mécanique de paire
    if (card.isJoker) {
      card.isFlipped = true;
      setCards(copy);
      return;
    }

    // Cas normal : on retourne la carte
    card.isFlipped = true;
    setCards(copy);

    if (!firstCard) {
      setFirstCard({ ...card, idx });
    } else {
      setSecondCard({ ...card, idx });
      setDisabled(true);
    }
  }

  // Vérification des paires (hors Joker)
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

  // Victoire quand toutes les paires sont trouvées
  useEffect(() => {
    if (matchedPairs === totalPairs && totalPairs > 0) {
      setGameOverMessage('Félicitations, vous avez gagné !');
      setDisabled(true);
    }
  }, [matchedPairs, totalPairs]);

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
        totalPairs={totalPairs}
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
