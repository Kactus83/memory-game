import React from 'react';
import './Card.css';

function Card({ card, onClick }) {
    return (
        <div
            className={`card ${card.isFlipped || card.isMatched ? 'flipped' : ''}`}
            onClick={onClick}
        >
            <div className="card-inner">
                <div className="card-front"></div>
                <div className="card-back">{card.value}</div>
            </div>
        </div>
    );
}

export default Card;