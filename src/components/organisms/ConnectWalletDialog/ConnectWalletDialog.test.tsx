import { composeStories } from '@storybook/react';
import { mockUseSF } from 'src/stories/mocks/useSFMock';
import { render, screen } from 'src/test-utils.js';
import * as stories from './ConnectWalletDialog.stories';

const { Default } = composeStories(stories);

const mockSecuredFinance = mockUseSF();
jest.mock('src/hooks/useSecuredFinance', () => () => mockSecuredFinance);

describe('DepositCollateral component', () => {
    it('should display the Connect Wallet Dialog when open', () => {
        render(<Default />);

        expect(screen.getByRole('dialog')).toBeInTheDocument();
        expect(
            screen.getByRole('heading', { name: 'Connect Wallet' })
        ).toBeInTheDocument();

        const button = screen.getByTestId('dialog-action-button');
        expect(button).toHaveTextContent('Connect');
    });
});
