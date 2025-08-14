import * as analytics from '@amplitude/analytics-browser';
import { composeStories } from '@storybook/react';
import { mockUseSF } from 'src/stories/mocks/useSFMock';
import { fireEvent, render, screen, waitFor } from 'src/test-utils.js';
import { ButtonEvents, ButtonProperties } from 'src/utils';
import * as stories from './WithdrawZCToken.stories';

const { Default } = composeStories(stories);

beforeEach(() => jest.clearAllMocks());

const mockSecuredFinance = mockUseSF();
jest.mock('src/hooks/useSecuredFinance', () => () => mockSecuredFinance);

describe('WithdrawZCToken component', () => {
    beforeEach(() => {
        mockSecuredFinance.getERC20TokenBalance.mockResolvedValueOnce(
            BigInt('10000000000'),
        );
    });

    it('should display the WithdrawZCToken Modal when open', () => {
        const onClose = jest.fn();
        render(<Default onClose={onClose} />);

        expect(screen.getByRole('dialog')).toBeInTheDocument();
        expect(screen.getByText('Withdraw ZC Bonds')).toBeInTheDocument();

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

    it('should disable the OK button when ZC Bond amount is 0 and OK button is clicked', () => {
        const onClose = jest.fn();
        render(<Default onClose={onClose} />);

        const button = screen.getByTestId('dialog-action-button');
        expect(button).toBeDisabled();
    });

    it('should select asset and update amount', async () => {
        render(<Default />);

        await waitFor(async () => {
            fireEvent.click(screen.getByTestId('asset-selector-button'));
            fireEvent.click(screen.getByTestId('asset-option-USDC'));
            expect(screen.getByText('ZC USDC')).toBeInTheDocument();
            expect(screen.getByText('1.25 Available')).toBeInTheDocument();

            const tab = screen.getByTestId(100);
            fireEvent.click(tab);
            expect(await screen.findByText('$1,250.00')).toBeInTheDocument();
        });
    });

    it('should reach success screen when transaction receipt is received', async () => {
        const onClose = jest.fn();
        render(<Default onClose={onClose} source='Source of Withdrawal' />);

        await waitFor(async () => {
            fireEvent.click(screen.getByTestId('asset-selector-button'));
            fireEvent.click(screen.getByTestId('asset-option-USDC-JUN2024'));
            fireEvent.click(screen.getByTestId(75));

            const button = screen.getByTestId('dialog-action-button');
            fireEvent.click(button);

            await waitFor(() => {
                expect(screen.getByText('Success!')).toBeInTheDocument();
                expect(
                    screen.getByText(
                        'You have successfully withdrawn ZC Bonds on Secured Finance.',
                    ),
                ).toBeInTheDocument();
                expect(screen.getByText('Status')).toBeInTheDocument();
                expect(screen.getByText('Complete')).toBeInTheDocument();
                expect(screen.getByText('Amount')).toBeInTheDocument();
                expect(screen.getByText('750')).toBeInTheDocument();

                expect(
                    screen.getByTestId('dialog-action-button'),
                ).toHaveTextContent('OK');
            });

            await waitFor(() => expect(onClose).not.toHaveBeenCalled());
        });
    });

    it('should call onClose when cancel button is clicked and emit CANCEL_BUTTON event', () => {
        const track = jest.spyOn(analytics, 'track');
        const onClose = jest.fn();
        render(<Default onClose={onClose} />);
        const cancelButton = screen.getByRole('button', {
            name: 'Cancel',
        });
        fireEvent.click(cancelButton);
        expect(track).toHaveBeenCalledWith(ButtonEvents.CANCEL_BUTTON, {
            [ButtonProperties.CANCEL_ACTION]: 'Cancel Withdraw ZC Bonds',
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

            fireEvent.click(screen.getByTestId('asset-selector-button'));
            fireEvent.click(screen.getByTestId('asset-option-USDC'));
            fireEvent.click(screen.getByTestId(75));

            const button = screen.getByTestId('dialog-action-button');
            fireEvent.click(button);

            await waitFor(() => {
                expect(cancelButton).not.toBeInTheDocument();
            });
        });
    });
});
