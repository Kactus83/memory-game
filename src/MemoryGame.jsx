import React, { useState, useEffect } from 'react';
import './MemoryGame.css';

import Card from './Card';
import Controls from './Controls';
import GameOver from './GameOver';

function shuffleCards(array) {
    const shuffledArray = array.slice();
    for (let i = shuffledArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
    }
    return shuffledArray;
}

function generateInitialCards(values) {
    const defaultValues = ['🍎', '🍌', '🍇', '🍉', '🍓', '🍑', '🥝', '🍍'];
    const cardValues = values || defaultValues;
    let id = 1;
    const cards = cardValues.flatMap(value => [
        { id: id++, value, isFlipped: false, isMatched: false },
        { id: id++, value, isFlipped: false, isMatched: false }
    ]);
    return shuffleCards(cards);
}

/**
 * Composant principal du jeu de Memory.
 *
 * @param {Object} props - Les propriétés du composant.
 * @param {Array} [props.initialCards] - Le jeu de cartes initial (optionnel pour les tests).
 * @returns {JSX.Element} Le rendu du jeu de Memory.
 */
function MemoryGame({ initialCards }) {
    // Si initialCards est fourni, on l'utilise tel quel, sinon on génère le jeu par défaut
    const [cards, setCards] = useState(() => {
        return initialCards ? shuffleCards(initialCards) : generateInitialCards();
    });

    const [firstCard, setFirstCard] = useState(null);
    const [secondCard, setSecondCard] = useState(null);
    const [disabled, setDisabled] = useState(false);
    const [matchedPairs, setMatchedPairs] = useState(0);
    const [timer, setTimer] = useState(60);
    const [gameOverMessage, setGameOverMessage] = useState('');
    const totalPairs = cards.length / 2;

    useEffect(() => {
        if (timer > 0 && !gameOverMessage) {
            const timerId = setInterval(() => setTimer(prev => prev - 1), 1000);
            return () => clearInterval(timerId);
        } else if (timer === 0) {
            setGameOverMessage('Temps écoulé ! Vous avez perdu.');
            setDisabled(true);
        }
    }, [timer, gameOverMessage]);

    function handleCardClick(index) {
        if (disabled || gameOverMessage) return;

        const newCards = [...cards];
        const clickedCard = newCards[index];

        if (clickedCard.isFlipped || clickedCard.isMatched) return;

        clickedCard.isFlipped = true;
        setCards(newCards);

        if (!firstCard) {
            setFirstCard({ ...clickedCard, index });
        } else {
            setSecondCard({ ...clickedCard, index });
            setDisabled(true);
        }
    }

    useEffect(() => {
        if (firstCard && secondCard) {
            if (firstCard.value === secondCard.value) {
                setCards(prevCards =>
                    prevCards.map(card => (card.value === firstCard.value ? { ...card, isMatched: true } : card))
                );
                setMatchedPairs(prev => prev + 1);
                resetTurn();
            } else {
                const timeoutId = setTimeout(() => {
                    setCards(prevCards =>
                        prevCards.map(card =>
                            card.id === firstCard.id || card.id === secondCard.id
                                ? { ...card, isFlipped: false }
                                : card
                        )
                    );
                    resetTurn();
                }, 1000);

                return () => clearTimeout(timeoutId);
            }
        }
    }, [firstCard, secondCard]);

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
        if (initialCards) {
            // Si on a fourni des cartes initiales pour les tests, on les réutilise simplement
            setCards(shuffleCards(initialCards));
        } else {
            // Sinon, on régénère le jeu par défaut
            setCards(generateInitialCards());
        }
        setFirstCard(null);
        setSecondCard(null);
        setMatchedPairs(0);
        setDisabled(false);
        setTimer(60);
        setGameOverMessage('');
    }

    return (
        <div className="memory-game">
            <h1>Jeu de Memory</h1>
            <Controls timer={timer} resetGame={resetGame} matchedPairs={matchedPairs} totalPairs={totalPairs} />
            {gameOverMessage && <GameOver message={gameOverMessage} />}
            <div className="grid" role="grid">
                {cards.map((card, index) => (
                    <Card key={card.id} card={card} onClick={() => handleCardClick(index)} />
                ))}
            </div>
        </div>
    );
}

export default MemoryGame;
