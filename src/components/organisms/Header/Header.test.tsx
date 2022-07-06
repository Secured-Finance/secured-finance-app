import { composeStories } from '@storybook/testing-react';
import { render, screen } from 'src/test-utils.js';
import * as stories from './Header.stories';

const { Primary } = composeStories(stories);

describe('Header component', () => {
    it('Should render the header', () => {
        render(<Primary />);
        expect(screen.getByText('OTC Lending')).toBeInTheDocument();
        expect(screen.getByText('Market Dashboard')).toBeInTheDocument();
        expect(screen.getByText('Portfolio Management')).toBeInTheDocument();
        expect(screen.getByText('Unlock Wallet')).toBeInTheDocument();
        expect(screen.getByText('Trader Pro')).toBeInTheDocument();
    });
});
