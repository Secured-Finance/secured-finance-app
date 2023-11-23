import * as analytics from '@amplitude/analytics-browser';
import { composeStories } from '@storybook/react';
import { preloadedAssetPrices } from 'src/stories/mocks/fixtures';
import { mockUseSF } from 'src/stories/mocks/useSFMock';
import { fireEvent, render, screen, waitFor } from 'src/test-utils.js';
import {
    CollateralEvents,
    CollateralProperties,
    CurrencySymbol,
} from 'src/utils';
import * as stories from './WithdrawCollateral.stories';

const { Default } = composeStories(stories);

const preloadedState = {
    ...preloadedAssetPrices,
};

beforeEach(() => jest.clearAllMocks());

const mockSecuredFinance = mockUseSF();
jest.mock('src/hooks/useSecuredFinance', () => () => mockSecuredFinance);

describe('WithdrawCollateral component', () => {
    it('should display the WithdrawCollateral Modal when open', () => {
        const onClose = jest.fn();
        render(<Default onClose={onClose} />);

        expect(screen.getByRole('dialog')).toBeInTheDocument();
        expect(screen.getByText('Withdraw Collateral')).toBeInTheDocument();

        const button = screen.getByTestId('dialog-action-button');
        expect(button).toHaveTextContent('Continue');
        expect(screen.getByRole('textbox')).toBeInTheDocument();
    });

    it('should open with placeholder zero', () => {
        render(<Default />);
        expect(screen.getByRole('textbox').getAttribute('value')).toBe('');
        expect(screen.getByRole('textbox').getAttribute('placeholder')).toBe(
            '0'
        );
    });

    it('should disable the continue button when collateral amount is 0 and continue button is clicked', () => {
        const onClose = jest.fn();
        render(<Default onClose={onClose} />);

        const button = screen.getByTestId('dialog-action-button');
        expect(button).toBeDisabled();
    });

    it('should select asset and update amount', () => {
        render(<Default />, { preloadedState });

        fireEvent.click(screen.getByTestId('collateral-selector-button'));
        fireEvent.click(screen.getByTestId('option-2'));
        expect(screen.getByText('USDC')).toBeInTheDocument();
        expect(screen.getByText('50 USDC Available')).toBeInTheDocument();

        const tab = screen.getByTestId(100);
        fireEvent.click(tab);
        expect(screen.getByText('$50.00')).toBeInTheDocument();
    });

    it('should reset amount to zero when asset is changed in collateral selector', () => {
        render(<Default />, { preloadedState });
        fireEvent.click(screen.getByTestId('collateral-selector-button'));
        fireEvent.click(screen.getByTestId('option-2'));

        const tab = screen.getByTestId(100);
        fireEvent.click(tab);
        expect(screen.getByText('$50.00')).toBeInTheDocument();
        expect(screen.getByRole('textbox').getAttribute('value')).toBe('50');

        fireEvent.click(screen.getByTestId('collateral-selector-button'));
        fireEvent.click(screen.getByTestId('option-1'));
        expect(screen.getByRole('textbox').getAttribute('value')).toBe('');
        expect(screen.getByRole('textbox').getAttribute('placeholder')).toBe(
            '0'
        );
    });

    it('should update the lastActionTimestamp in the store when the transaction receipt is received', async () => {
        const { store } = render(<Default />, { preloadedState });
        fireEvent.click(screen.getByTestId('collateral-selector-button'));
        fireEvent.click(screen.getByTestId('option-2'));
        fireEvent.click(screen.getByTestId(75));
        fireEvent.click(screen.getByTestId('dialog-action-button'));
        expect(store.getState().blockchain.lastActionTimestamp).toBe(0);
        expect(await screen.findByText('Success!')).toBeInTheDocument();
        expect(store.getState().blockchain.lastActionTimestamp).toBeTruthy();
    });

    it('should proceed to failure screen and call onclose when block number is undefined', async () => {
        mockSecuredFinance.withdrawCollateral.mockResolvedValueOnce('');
        const onClose = jest.fn();
        render(<Default onClose={onClose} />, { preloadedState });
        fireEvent.click(screen.getByTestId('collateral-selector-button'));
        fireEvent.click(screen.getByTestId('option-2'));
        expect(screen.getByText('USDC')).toBeInTheDocument();
        expect(screen.getByText('50 USDC Available')).toBeInTheDocument();

        const tab = screen.getByTestId(75);
        fireEvent.click(tab);
        expect(screen.getByText('$37.50')).toBeInTheDocument();

        const button = screen.getByTestId('dialog-action-button');
        fireEvent.click(button);

        await waitFor(() =>
            expect(screen.queryByText('Success!')).not.toBeInTheDocument()
        );
        await waitFor(() =>
            expect(screen.queryByText('Failed!')).toBeInTheDocument()
        );
        const onCloseButton = screen.getByTestId('dialog-action-button');
        fireEvent.click(onCloseButton);

        await waitFor(() => expect(onClose).toBeCalled());
    });

    it('should disable the continue button when collateral amount is greater than available amount', () => {
        const onClose = jest.fn();
        render(<Default onClose={onClose} />);
        const input = screen.getByRole('textbox');
        fireEvent.click(screen.getByTestId('collateral-selector-button'));
        fireEvent.click(screen.getByTestId('option-0'));
        expect(screen.getByText('Ethereum')).toBeInTheDocument();
        expect(screen.getByText('1 Ethereum Available')).toBeInTheDocument();
        fireEvent.change(input, { target: { value: '10' } });
        const button = screen.getByTestId('dialog-action-button');
        expect(button).toBeDisabled();
    });

    it('should track the withdrawing of collateral', async () => {
        const track = jest.spyOn(analytics, 'track');
        const onClose = jest.fn();
        render(<Default onClose={onClose} source='Source of Withdrawal' />, {
            preloadedState,
        });

        fireEvent.click(screen.getByTestId('collateral-selector-button'));
        fireEvent.click(screen.getByTestId('option-2'));
        fireEvent.click(screen.getByTestId(75));

        const button = screen.getByTestId('dialog-action-button');
        fireEvent.click(button);
        await waitFor(() =>
            expect(track).toHaveBeenCalledWith(
                CollateralEvents.WITHDRAW_COLLATERAL,
                {
                    [CollateralProperties.ASSET_TYPE]: 'USDC',
                    [CollateralProperties.AMOUNT]: '37.5',
                    [CollateralProperties.SOURCE]: 'Source of Withdrawal',
                }
            )
        );
    });

    it('should reach success screen when transaction receipt is received', async () => {
        const onClose = jest.fn();
        render(<Default onClose={onClose} source='Source of Withdrawal' />, {
            preloadedState,
        });

        fireEvent.click(screen.getByTestId('collateral-selector-button'));
        fireEvent.click(screen.getByTestId('option-2'));
        fireEvent.click(screen.getByTestId(75));

        const button = screen.getByTestId('dialog-action-button');
        fireEvent.click(button);

        await waitFor(() => {
            expect(screen.getByText('Success!')).toBeInTheDocument();
            expect(
                screen.getByText(
                    'You have successfully withdrawn collateral on Secured Finance.'
                )
            ).toBeInTheDocument();
            expect(screen.getByText('Status')).toBeInTheDocument();
            expect(screen.getByText('Complete')).toBeInTheDocument();
            expect(screen.getByText('Amount')).toBeInTheDocument();
            expect(screen.getByText('37.5 USDC')).toBeInTheDocument();

            expect(
                screen.getByTestId('dialog-action-button')
            ).toHaveTextContent('OK');
        });

        await waitFor(() => expect(onClose).not.toHaveBeenCalled());
    });

    it('should withdraw whole amount when 100% is clicked', async () => {
        const track = jest.spyOn(analytics, 'track');
        render(<Default source='Source of Withdrawal' />, {
            preloadedState,
        });

        fireEvent.click(screen.getByTestId('collateral-selector-button'));
        fireEvent.click(screen.getByTestId('option-3'));

        expect(screen.getByText('Bitcoin')).toBeInTheDocument();
        expect(
            screen.getByText('1.1235 Bitcoin Available')
        ).toBeInTheDocument();

        fireEvent.click(screen.getByTestId(100));

        const button = screen.getByTestId('dialog-action-button');
        expect(button).toBeEnabled();

        fireEvent.click(button);
        await waitFor(() =>
            expect(track).toHaveBeenCalledWith(
                CollateralEvents.WITHDRAW_COLLATERAL,
                {
                    [CollateralProperties.ASSET_TYPE]: 'WBTC',
                    [CollateralProperties.AMOUNT]: '1.12349999',
                    [CollateralProperties.SOURCE]: 'Source of Withdrawal',
                }
            )
        );
    });

    it('should open the modal with the selected asset if currency is passed as argument', () => {
        render(<Default selected={CurrencySymbol.USDC} />, { preloadedState });
        expect(screen.getByText('USDC')).toBeInTheDocument();
        expect(screen.getByText('50 USDC Available')).toBeInTheDocument();
    });

    it('should call onClose when cancel button is clicked', () => {
        const onClose = jest.fn();
        render(<Default onClose={onClose} />, {
            preloadedState,
        });
        const cancelButton = screen.getByRole('button', {
            name: 'Cancel',
        });
        fireEvent.click(cancelButton);
        expect(onClose).toHaveBeenCalled();
    });

    it('should not show cancel button if dialog is not on first step', async () => {
        render(<Default />, {
            preloadedState,
        });
        const cancelButton = await screen.findByRole('button', {
            name: 'Cancel',
        });
        expect(cancelButton).toBeInTheDocument();
        fireEvent.click(screen.getByTestId('collateral-selector-button'));
        fireEvent.click(screen.getByTestId('option-0'));
        fireEvent.click(screen.getByTestId(75));

        const button = screen.getByTestId('dialog-action-button');
        fireEvent.click(button);
        await waitFor(() => {
            expect(cancelButton).not.toBeInTheDocument();
        });
    });
});
