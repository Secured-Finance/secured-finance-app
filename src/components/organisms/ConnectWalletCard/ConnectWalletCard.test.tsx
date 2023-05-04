import { composeStories } from '@storybook/testing-react';
import { render, screen } from 'src/test-utils.js';
import * as stories from './ConnectWalletCard.stories';

const { Default } = composeStories(stories);

const preloadedState = {
    blockchain: {
        chainError: true,
    },
};

describe('test ConnectWalletCard component', () => {
    it('should render ConnectWalletCard', () => {
        render(<Default />);
        expect(
            screen.getByText(
                'Welcome to the future of DeFi. Secured Finance brings Interbank-grade lending solution to Web3.'
            )
        ).toBeInTheDocument();
        expect(screen.getByRole('button')).toBeInTheDocument();
        expect(screen.getByText('Connect Wallet')).toBeInTheDocument();
    });

    it('should render a disabled connect wallet button on chain error', () => {
        render(<Default />, { preloadedState });
        expect(screen.getByText('Connect Wallet')).toBeInTheDocument();
        expect(screen.getByRole('button')).toBeDisabled();
    });
});
