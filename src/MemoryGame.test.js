import { render, screen } from '@testing-library/react';
import { act } from 'react';
import MemoryGame from './MemoryGame';

describe('MemoryGame Component - Création et état initial', () => {
    test('crée un jeu de cartes par défaut avec 8 paires (16 cartes)', () => {
        act(() => {
            render(<MemoryGame />);
        });
        
        // Sélectionne toutes les cartes initiales
        const allCards = screen.getAllByRole('button', { name: /Carte fermé/i });

        // Vérifie qu'il y a exactement 16 cartes
        expect(allCards).toHaveLength(16);
    });

    test('toutes les cartes sont face cachée au début', () => {
        act(() => {
            render(<MemoryGame />);
        });

        // Sélectionne toutes les cartes avec la classe par défaut (non retournée)
        const allCards = screen.getAllByRole('button');

        // Vérifie que chaque carte n'a pas la classe "flipped"
        allCards.forEach((card) => {
            expect(card).not.toHaveClass('flipped');
        });
    });

    test('les cartes sont mélangées (ordre non prévisible)', () => {
        const firstRenderOrder = [];
        const secondRenderOrder = [];

        // Rendu initial pour capturer l'ordre des cartes
        act(() => {
            render(<MemoryGame />);
        });
        const firstRenderCards = screen.getAllByRole('button', { name: /Carte fermé/i });
        firstRenderCards.forEach((card) => firstRenderOrder.push(card.dataset.testid));

        // Efface le DOM pour simuler un nouveau jeu
        act(() => {
            render(<MemoryGame />);
        });
        const secondRenderCards = screen.getAllByRole('button', { name: /Carte fermé/i });
        secondRenderCards.forEach((card) => secondRenderOrder.push(card.dataset.testid));

        // Compare les deux ordres pour vérifier qu'ils sont différents
        expect(firstRenderOrder).not.toEqual(secondRenderOrder);
    });
});
