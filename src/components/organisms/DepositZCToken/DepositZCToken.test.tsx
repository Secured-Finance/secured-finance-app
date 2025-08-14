import * as analytics from '@amplitude/analytics-browser';
import { composeStories } from '@storybook/react';
import { mockUseSF } from 'src/stories/mocks/useSFMock';
import { fireEvent, render, screen, waitFor } from 'src/test-utils.js';
import {
    ButtonEvents,
    ButtonProperties,
    ZCTokenEvents,
    ZCTokenProperties,
} from 'src/utils';
import * as stories from './DepositZCToken.stories';

const { Default } = composeStories(stories);

const mockSecuredFinance = mockUseSF();
jest.mock('src/hooks/useSecuredFinance', () => () => mockSecuredFinance);

describe('DepositZCToken component', () => {
    beforeEach(() => {
        mockSecuredFinance.getERC20TokenBalance.mockResolvedValueOnce(
            BigInt('10000000000'),
        );
    });

    it('should display the DepositZCToken Modal when open', () => {
        render(<Default />);

        expect(screen.getByRole('dialog')).toBeInTheDocument();
        expect(screen.getByText('Deposit ZC Bonds')).toBeInTheDocument();

        const button = screen.getByTestId('dialog-action-button');
        expect(button).toHaveTextContent('OK');

        expect(screen.getByRole('textbox')).toBeInTheDocument();
    });

    it('should open with placeholder zero', () => {
        render(<Default />);
        expect(screen.getByRole('textbox').getAttribute('value')).toBe('');
        expect(screen.getByRole('textbox').getAttribute('placeholder')).toBe(
            '0',
        );
    });

    it('should select asset and update amount', async () => {
        render(<Default />);
        await waitFor(async () => {
            fireEvent.click(screen.getByTestId('maturity-selector-button'));
            fireEvent.click(screen.getByTestId('maturity-option-1719532800'));
            expect(screen.getByText('ZC USDC JUN2024')).toBeInTheDocument();
            expect(screen.getByText('10,000 Available')).toBeInTheDocument();
        });
    });

    it('should reach success screen when transaction receipt is received', async () => {
        const onClose = jest.fn();
        render(<Default onClose={onClose} />);

        await waitFor(async () => {
            fireEvent.click(screen.getByTestId('maturity-selector-button'));
            fireEvent.click(screen.getByTestId('maturity-option-1719532800'));
            expect(screen.getByText('10,000 Available')).toBeInTheDocument();
            fireEvent.click(screen.getByTestId(75));
            fireEvent.click(screen.getByTestId('dialog-action-button'));
            expect(await screen.findByText('Success!')).toBeInTheDocument();

            expect(
                screen.getByText(
                    'You have successfully deposited ZC Bonds on Secured Finance.',
                ),
            ).toBeInTheDocument();
            expect(screen.getByText('Status')).toBeInTheDocument();
            expect(screen.getByText('Complete')).toBeInTheDocument();
            expect(screen.getByText('Transaction hash')).toBeInTheDocument();
            expect(screen.getByText('0xb98bd7...65e4')).toBeInTheDocument();
            expect(screen.getByText('Amount')).toBeInTheDocument();
            expect(screen.getByText('7,500')).toBeInTheDocument();
        });

        await waitFor(() => expect(onClose).not.toHaveBeenCalled());
    });

    it('should reach failure screen when transaction fails', async () => {
        mockSecuredFinance.depositZCToken.mockRejectedValueOnce(
            new Error('error'),
        );
        const onClose = jest.fn();
        render(<Default onClose={onClose} />);

        await waitFor(async () => {
            fireEvent.click(screen.getByTestId('maturity-selector-button'));
            fireEvent.click(screen.getByTestId('maturity-option-1719532800'));
            expect(screen.getByText('10,000 Available')).toBeInTheDocument();
            fireEvent.click(screen.getByTestId(75));

            const button = screen.getByTestId('dialog-action-button');
            fireEvent.click(button);
            await waitFor(() => {
                expect(screen.getByText('Failed!')).toBeInTheDocument();
                expect(screen.getByText('error')).toBeInTheDocument();
            });
        });
    });

    it('should disable the OK button when ZC Bound amount is greater than available amount', async () => {
        const onClose = jest.fn();
        render(<Default onClose={onClose} />);

        await waitFor(async () => {
            const input = screen.getByRole('textbox');
            fireEvent.click(screen.getByTestId('maturity-selector-button'));
            fireEvent.click(screen.getByTestId('maturity-option-1719532800'));
            expect(screen.getByText('10,000 Available')).toBeInTheDocument();
            fireEvent.change(input, { target: { value: '11000' } });
            const button = screen.getByTestId('dialog-action-button');
            expect(button).toBeDisabled();
        });
    });

    it('should disable the button when ZC Bound is zero', () => {
        const onClose = jest.fn();
        render(<Default onClose={onClose} />);

        const button = screen.getByTestId('dialog-action-button');
        expect(button).toBeDisabled();
    });

    it('should track the deposit ZC Token', async () => {
        const onClose = jest.fn();
        const track = jest.spyOn(analytics, 'track');
        render(<Default onClose={onClose} source='Source Of Deposit' />);
        await waitFor(async () => {
            fireEvent.click(screen.getByTestId('maturity-selector-button'));
            fireEvent.click(screen.getByTestId('maturity-option-1719532800'));
            expect(screen.getByText('10,000 Available')).toBeInTheDocument();
            fireEvent.click(screen.getByTestId(75));

            const button = screen.getByTestId('dialog-action-button');
            fireEvent.click(button);

            await waitFor(() => {
                expect(track).toHaveBeenCalledWith(
                    ZCTokenEvents.DEPOSIT_ZC_TOKEN,
                    {
                        [ZCTokenProperties.ASSET_TYPE]: 'USDC',
                        [ZCTokenProperties.MATURITY]: 1719532800,
                        [ZCTokenProperties.AMOUNT]: '7500',
                        [ZCTokenProperties.SOURCE]: 'Source Of Deposit',
                    },
                );
            });
        });
    });

    it('should call onClose when cancel button and emit CANCEL_BUTTON event is clicked', () => {
        const track = jest.spyOn(analytics, 'track');
        const onClose = jest.fn();
        render(<Default onClose={onClose} />);
        const cancelButton = screen.getByRole('button', {
            name: 'Cancel',
        });
        fireEvent.click(cancelButton);
        expect(track).toHaveBeenCalledWith(ButtonEvents.CANCEL_BUTTON, {
            [ButtonProperties.CANCEL_ACTION]: 'Cancel Deposit ZC Bonds',
        });
        expect(onClose).toHaveBeenCalled();
    });

    it('should not show cancel button if dialog is not on first step', async () => {
        render(<Default />);

        await waitFor(async () => {
            const cancelButton = await screen.findByRole('button', {
                name: 'Cancel',
            });
            expect(cancelButton).toBeInTheDocument();
            fireEvent.click(screen.getByTestId('maturity-selector-button'));
            fireEvent.click(screen.getByTestId('maturity-option-1719532800'));
            expect(screen.getByText('10,000 Available')).toBeInTheDocument();
            fireEvent.click(screen.getByTestId(75));

            const button = screen.getByTestId('dialog-action-button');
            fireEvent.click(button);
            await waitFor(() => {
                expect(cancelButton).not.toBeInTheDocument();
            });
        });
    });
});
