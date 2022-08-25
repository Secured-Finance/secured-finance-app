import { composeStories } from '@storybook/testing-react';
import { render, screen } from 'src/test-utils.js';
import * as stories from './MyWalletCard.stories';

const { Default } = composeStories(stories);

describe('test MyWalletCard component', () => {
    it('should render MyWalletCard', () => {
        render(<Default />);
        expect(screen.getByText('My Wallet')).toBeInTheDocument();
        expect(screen.getByText('de926d...aa4f')).toBeInTheDocument();
        expect(screen.getByText('de926db3012a...24b5')).toBeInTheDocument();
        expect(screen.getAllByRole('button')).toHaveLength(2);
    });
});
