import * as analytics from '@amplitude/analytics-browser';
import { composeStories } from '@storybook/react';
import { mockUseSF } from 'src/stories/mocks/useSFMock';
import { fireEvent, render, screen, waitFor } from 'src/test-utils.js';
import { CollateralEvents, CollateralProperties } from 'src/utils';
import * as stories from './DepositCollateral.stories';

const { Default } = composeStories(stories);

const mockSecuredFinance = mockUseSF();
jest.mock('src/hooks/useSecuredFinance', () => () => mockSecuredFinance);

describe('DepositCollateral component', () => {
    it('should display the DepositCollateral Modal when open', () => {
        render(<Default />);

        expect(screen.getByRole('dialog')).toBeInTheDocument();
        expect(screen.getByText('Deposit Collateral')).toBeInTheDocument();

        const button = screen.getByTestId('dialog-action-button');
        expect(button).toHaveTextContent('OK');

        expect(screen.getByRole('textbox')).toBeInTheDocument();
    });

    it('should open with placeholder zero', () => {
        render(<Default />);
        expect(screen.getByRole('textbox').getAttribute('value')).toBe('');
        expect(screen.getByRole('textbox').getAttribute('placeholder')).toBe(
            '0'
        );
    });

    it('should select asset and update amount', async () => {
        render(<Default />);
        fireEvent.click(screen.getByTestId('collateral-selector-button'));
        fireEvent.click(screen.getByTestId('option-0'));
        expect(screen.getByText('USDC')).toBeInTheDocument();
        expect(screen.getByText('50 USDC Available')).toBeInTheDocument();

        const tab = screen.getByTestId(75);
        fireEvent.click(tab);
        expect(await screen.findByText('$37.50')).toBeInTheDocument();
    });

    it('should reset amount to zero when asset is changed in collateral selector', async () => {
        render(<Default />);
        fireEvent.click(screen.getByTestId('collateral-selector-button'));
        fireEvent.click(screen.getByTestId('option-0'));

        const tab = screen.getByTestId(75);
        fireEvent.click(tab);
        expect(await screen.findByText('$37.50')).toBeInTheDocument();
        expect(screen.getByRole('textbox').getAttribute('value')).toBe('37.5');

        fireEvent.click(screen.getByTestId('collateral-selector-button'));
        fireEvent.click(screen.getByTestId('option-1'));
        expect(screen.getByRole('textbox').getAttribute('value')).toBe('');
        expect(screen.getByRole('textbox').getAttribute('placeholder')).toBe(
            '0'
        );
    });

    it('should update the lastActionTimestamp in the store when the transaction receipt is received', async () => {
        const { store } = render(<Default />);
        expect(store.getState().blockchain.lastActionTimestamp).toEqual(0);
        fireEvent.click(screen.getByTestId('collateral-selector-button'));
        fireEvent.click(screen.getByTestId('option-0'));
        fireEvent.click(screen.getByTestId(75));
        fireEvent.click(screen.getByTestId('dialog-action-button'));
        expect(await screen.findByText('Success!')).toBeInTheDocument();
        expect(store.getState().blockchain.lastActionTimestamp).toBeTruthy();
    });

    it('should reach success screen when transaction receipt is received', async () => {
        const onClose = jest.fn();
        render(<Default onClose={onClose} />);
        fireEvent.click(screen.getByTestId('collateral-selector-button'));
        fireEvent.click(screen.getByTestId('option-0'));
        expect(screen.getByText('USDC')).toBeInTheDocument();
        expect(screen.getByText('50 USDC Available')).toBeInTheDocument();

        const tab = screen.getByTestId(75);
        fireEvent.click(tab);
        expect(await screen.findByText('$37.50')).toBeInTheDocument();

        const button = screen.getByTestId('dialog-action-button');
        fireEvent.click(button);

        await waitFor(() => {
            expect(screen.getByText('Success!')).toBeInTheDocument();
            expect(
                screen.getByText(
                    'You have successfully deposited collateral on Secured Finance.'
                )
            ).toBeInTheDocument();
            expect(screen.getByText('Status')).toBeInTheDocument();
            expect(screen.getByText('Complete')).toBeInTheDocument();
            expect(screen.getByText('Transaction hash')).toBeInTheDocument();
            expect(screen.getByText('0xb98bd7...65e4')).toBeInTheDocument();
            expect(screen.getByText('Amount')).toBeInTheDocument();
            expect(screen.getByText('37.5 USDC')).toBeInTheDocument();

            expect(
                screen.getByTestId('dialog-action-button')
            ).toHaveTextContent('OK');
        });

        await waitFor(() => expect(onClose).not.toHaveBeenCalled());
    });

    it('should open with USDC as default currency', () => {
        render(<Default />);
        expect(screen.getByText('USDC')).toBeInTheDocument();
        expect(screen.getByText('50 USDC Available')).toBeInTheDocument();
        expect(screen.queryByText('ETH')).not.toBeInTheDocument();
        expect(screen.queryByText('ETH Available')).not.toBeInTheDocument();
        expect(screen.queryByText('WFIL')).not.toBeInTheDocument();
        expect(screen.queryByText('WFIL Available')).not.toBeInTheDocument();
        expect(screen.queryByText('WBTC')).not.toBeInTheDocument();
        expect(screen.queryByText('WBTC Available')).not.toBeInTheDocument();
    });

    it('should reach failure screen when transaction fails', async () => {
        mockSecuredFinance.depositCollateral.mockRejectedValueOnce(
            new Error('error')
        );
        const onClose = jest.fn();
        render(<Default onClose={onClose} />);
        fireEvent.click(screen.getByTestId('collateral-selector-button'));
        fireEvent.click(screen.getByTestId('option-0'));
        expect(screen.getByText('USDC')).toBeInTheDocument();
        expect(screen.getByText('50 USDC Available')).toBeInTheDocument();

        const tab = screen.getByTestId(75);
        fireEvent.click(tab);
        expect(await screen.findByText('$37.50')).toBeInTheDocument();

        const button = screen.getByTestId('dialog-action-button');
        fireEvent.click(button);
        await waitFor(() => {
            expect(screen.getByText('Failed!')).toBeInTheDocument();
            expect(screen.getByText('error')).toBeInTheDocument();
        });
    });

    it('should disable the OK button when collateral amount is greater than available amount', () => {
        const onClose = jest.fn();
        render(<Default onClose={onClose} />);
        const input = screen.getByRole('textbox');
        fireEvent.click(screen.getByTestId('collateral-selector-button'));
        fireEvent.click(screen.getByTestId('option-0'));
        expect(screen.getByText('USDC')).toBeInTheDocument();
        expect(screen.getByText('50 USDC Available')).toBeInTheDocument();
        fireEvent.change(input, { target: { value: '100' } });
        const button = screen.getByTestId('dialog-action-button');
        expect(button).toBeDisabled();
    });

    it('should disable the button when collateral is zero', () => {
        const onClose = jest.fn();
        render(<Default onClose={onClose} />);

        const button = screen.getByTestId('dialog-action-button');
        expect(button).toBeDisabled();
    });

    it('should track the deposit collateral', async () => {
        const track = jest.spyOn(analytics, 'track');
        const onClose = jest.fn();
        render(<Default onClose={onClose} source='Source Of Deposit' />);
        fireEvent.click(screen.getByTestId('collateral-selector-button'));
        fireEvent.click(screen.getByTestId('option-0'));
        fireEvent.click(screen.getByTestId(75));

        const button = screen.getByTestId('dialog-action-button');
        fireEvent.click(button);
        await waitFor(() =>
            expect(track).toHaveBeenCalledWith(
                CollateralEvents.DEPOSIT_COLLATERAL,
                {
                    [CollateralProperties.ASSET_TYPE]: 'USDC',
                    [CollateralProperties.AMOUNT]: '37.5',
                    [CollateralProperties.SOURCE]: 'Source Of Deposit',
                }
            )
        );
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
