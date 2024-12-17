import React from 'react';
import './Card.css';

/**
 * Composant représentant une carte du jeu de Memory.
 *
 * @param {Object} props - Les propriétés du composant.
 * @param {Object} props.card - L'objet représentant la carte.
 * @param {Function} props.onClick - La fonction à appeler lors du clic sur la carte.
 * @returns {JSX.Element} Le rendu de la carte.
 */
function Card({ card, onClick }) {
    return (
        <button
            type="button"
            role="button"
            aria-pressed={card.isFlipped || card.isMatched}
            className={`card ${card.isFlipped || card.isMatched ? 'flipped' : ''}`}
            onClick={onClick}
            data-testid={`card-${card.id}`}
            aria-label={`Carte ${card.isFlipped || card.isMatched ? card.value : 'fermé'}`}
        >
            <div className="card-inner">
                <div className="card-front"></div>
                <div className="card-back">{card.value}</div>
            </div>
        </button>
    );
}

export default Card;
