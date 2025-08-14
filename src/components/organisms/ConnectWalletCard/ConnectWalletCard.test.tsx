import { composeStories } from '@storybook/react';
import { render, screen } from 'src/test-utils.js';
import * as stories from './ConnectWalletCard.stories';

const { Default } = composeStories(stories);

describe('test ConnectWalletCard component', () => {
    it('should render ConnectWalletCard', () => {
        render(<Default />);
        expect(
            screen.getByText(
                'Welcome to the future of DeFi. Secured Finance brings Interbank-grade lending solution to Web3.',
            ),
        ).toBeInTheDocument();
        expect(screen.getByRole('button')).toBeInTheDocument();
        expect(screen.getByText('Connect Wallet')).toBeInTheDocument();
    });
});
