import { composeStories } from '@storybook/testing-react';
import { preloadedAssetPrices } from 'src/stories/mocks/fixtures';
import { mockUseSF } from 'src/stories/mocks/useSFMock';
import { fireEvent, render, screen, waitFor } from 'src/test-utils.js';
import * as stories from './DepositCollateral.stories';

const { Default } = composeStories(stories);

const preloadedState = { ...preloadedAssetPrices };

const mockSecuredFinance = mockUseSF();
jest.mock('src/hooks/useSecuredFinance', () => () => mockSecuredFinance);

describe('DepositCollateral component', () => {
    it('should display the DepositCollateral Modal when open', () => {
        render(<Default />);

        expect(screen.getByRole('dialog')).toBeInTheDocument();
        expect(screen.getByText('Deposit Collateral')).toBeInTheDocument();

        const button = screen.getByTestId('dialog-action-button');
        expect(button).toHaveTextContent('Continue');

        expect(screen.getByRole('textbox')).toBeInTheDocument();
    });

    it('should open with collateral amount 0', () => {
        render(<Default />);
        expect(screen.getByRole('textbox').getAttribute('value')).toBe('');
        expect(screen.getByRole('textbox').getAttribute('placeholder')).toBe(
            '0'
        );
    });

    it('should do nothing when collateral amount is 0 and continue button is clicked', () => {
        const onClose = jest.fn();
        render(<Default onClose={onClose} />);

        const button = screen.getByTestId('dialog-action-button');
        fireEvent.click(button);
        expect(onClose).not.toHaveBeenCalled();
        expect(screen.getByRole('textbox')).toBeInTheDocument();
    });

    it('should select asset and update amount', () => {
        render(<Default />, { preloadedState });
        fireEvent.click(screen.getByTestId('collateral-selector-button'));
        fireEvent.click(screen.getByTestId('option-1'));
        expect(screen.getByText('USDC')).toBeInTheDocument();
        expect(screen.getByText('50 USDC Available')).toBeInTheDocument();

        const tab = screen.getByTestId(75);
        fireEvent.click(tab);
        expect(screen.getByText('$37.50')).toBeInTheDocument();
    });

    it('should reach success screen when transaction receipt is received', async () => {
        const onClose = jest.fn();
        render(<Default onClose={onClose} />, { preloadedState });
        fireEvent.click(screen.getByTestId('collateral-selector-button'));
        fireEvent.click(screen.getByTestId('option-1'));
        expect(screen.getByText('USDC')).toBeInTheDocument();
        expect(screen.getByText('50 USDC Available')).toBeInTheDocument();

        const tab = screen.getByTestId(75);
        fireEvent.click(tab);
        expect(screen.getByText('$37.50')).toBeInTheDocument();

        const button = screen.getByTestId('dialog-action-button');
        fireEvent.click(button);

        await waitFor(() =>
            expect(screen.getByText('Success!')).toBeInTheDocument()
        );

        await waitFor(() => expect(onClose).not.toHaveBeenCalled());
    });
});
