import { composeStories } from '@storybook/testing-react';
import { fireEvent, render, screen } from 'src/test-utils.js';
import * as stories from './ConnectWalletCard.stories';

const { Default } = composeStories(stories);

// @ts-expect-error: this is a mock for the IntersectionObserver.
global.IntersectionObserver = class FakeIntersectionObserver {
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    observe() {}
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    disconnect() {}
};

describe('test ConnectWalletCard component', () => {
    it('should render ConnectWalletCard', () => {
        render(<Default />);
        expect(
            screen.getByText(
                'Welcome to the future of DeFi. Secured Finance brings Interbank-grade lending solution to Web3.'
            )
        ).toBeInTheDocument();
        const button = screen.getByRole('button');
        fireEvent.click(button);
        expect(screen.getByText('Select Wallet Provider')).toBeInTheDocument();
    });
});
