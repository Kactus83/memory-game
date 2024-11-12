import React, { useState, useEffect } from 'react';
import './MemoryGame.css';

import Card from './Card';
import Controls from './Controls';
import GameOver from './GameOver';

// Fonction pour mélanger un tableau de cartes
function shuffleCards(array) {
    const shuffledArray = array.slice();
    for (let i = shuffledArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
    }
    return shuffledArray;
}

// Fonction pour générer le jeu de cartes initial
function generateInitialCards() {
    const values = ['🍎', '🍌', '🍇', '🍉', '🍓', '🍑', '🥝', '🍍'];
    let id = 1;
    const cards = values.flatMap(value => [
        { id: id++, value, isFlipped: false, isMatched: false },
        { id: id++, value, isFlipped: false, isMatched: false }
    ]);
    return shuffleCards(cards);
}

function MemoryGame() {
    const [cards, setCards] = useState(generateInitialCards());
    const [firstCard, setFirstCard] = useState(null);
    const [secondCard, setSecondCard] = useState(null);
    const [disabled, setDisabled] = useState(false);
    const [matchedPairs, setMatchedPairs] = useState(0);
    const [timer, setTimer] = useState(60);
    const [gameOverMessage, setGameOverMessage] = useState('');
    const totalPairs = cards.length / 2;

    // Compte à rebours pour le temps restant
    useEffect(() => {
        if (timer > 0 && !gameOverMessage) {
            const timerId = setInterval(() => setTimer(prev => prev - 1), 1000);
            return () => clearInterval(timerId);
        } else if (timer === 0) {
            setGameOverMessage('Temps écoulé ! Vous avez perdu.');
            setDisabled(true);
        }
    }, [timer, gameOverMessage]);

    // Gestion du clic sur une carte
    function handleCardClick(index) {

        // Sécurité pour eviter les clics hors d'une partie
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

    // Vérification si les cartes correspondent
    useEffect(() => {
        if (firstCard && secondCard) {
            // Si les cartes correspondent
            if (firstCard.value === secondCard.value) {
                setCards(prevCards =>
                    prevCards.map(card => (card.value === firstCard.value ? { ...card, isMatched: true } : card))
                );
                setMatchedPairs(prev => prev + 1);
                resetTurn();
                // Si elles ne correspondent pas
            } else {
                // Animation d'echec de matching 1 sec
                setTimeout(() => {
                    setCards(prevCards =>
                        prevCards.map(card =>
                            card.id === firstCard.id || card.id === secondCard.id
                                ? { ...card, isFlipped: false }
                                : card
                        )
                    );
                    resetTurn();
                }, 1000);
            }
        }
    }, [firstCard, secondCard]);

    // Fin de la partie quand toutes les paires sont trouvées
    useEffect(() => {
        if (matchedPairs === totalPairs) {
            setGameOverMessage('Félicitations, vous avez gagné !');
            setDisabled(true);
        }
    }, [matchedPairs, totalPairs]);

    // Réinitialisation des cartes et du tour
    function resetTurn() {
        setFirstCard(null);
        setSecondCard(null);
        setDisabled(false);
    }

    // Réinitialisation complète du jeu
    function resetGame() {
        setCards(generateInitialCards());
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
            <div className="grid">
                {cards.map((card, index) => (
                    <Card key={card.id} card={card} onClick={() => handleCardClick(index)} />
                ))}
            </div>
        </div>
    );
}

export default MemoryGame;