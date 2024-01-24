import * as analytics from '@amplitude/analytics-browser';
import { OrderSide } from '@secured-finance/sf-client';
import { composeStories } from '@storybook/react';
import { dec22Fixture, usdcBytes32 } from 'src/stories/mocks/fixtures';
import { mockUseSF } from 'src/stories/mocks/useSFMock';
import { fireEvent, render, screen, waitFor } from 'src/test-utils.js';
import { OrderType } from 'src/types';
import { ButtonEvents, CurrencySymbol, WalletSource } from 'src/utils';
import * as stories from './OrderAction.stories';

const {
    EnoughCollateral,
    NotEnoughCollateral,
    Primary,
    RenderOrderSideButton,
} = composeStories(stories);

const preloadedState = {
    landingOrderForm: {
        currency: CurrencySymbol.USDC,
        maturity: dec22Fixture.toNumber(),
        side: OrderSide.BORROW,
        amount: '500000000',
        unitPrice: 0,
        orderType: OrderType.LIMIT,
        sourceAccount: WalletSource.METAMASK,
    },
    blockchain: {
        chainError: false,
    },
};

const mockSecuredFinance = mockUseSF();
jest.mock('src/hooks/useSecuredFinance', () => () => mockSecuredFinance);

describe('OrderAction component', () => {
    const track = jest.spyOn(analytics, 'track');
    it('should render connect wallet button', async () => {
        await waitFor(() => render(<Primary />, { preloadedState }));
        expect(screen.getByRole('button')).toBeInTheDocument();
        expect(screen.getByText('Connect Wallet')).toBeInTheDocument();
    });

    it('should render deposit collateral button when collateral is not sufficient and emit deposit collateral button event when clicked', async () => {
        await waitFor(() =>
            render(<NotEnoughCollateral />, {
                preloadedState: {
                    ...preloadedState,
                    landingOrderForm: {
                        ...preloadedState.landingOrderForm,
                        amount: '6000000000',
                    },
                },
            })
        );
        expect(
            await screen.findByTestId('deposit-collateral-button')
        ).toBeInTheDocument();
        expect(
            screen.getByText('Deposit collateral to borrow')
        ).toBeInTheDocument();
        const button = screen.getByTestId('deposit-collateral-button');
        fireEvent.click(button);
        expect(track).toHaveBeenCalledWith(
            ButtonEvents.DEPOSIT_COLLATERAL_BUTTON
        );
        expect(
            screen.getByRole('dialog', { name: 'Deposit Collateral' })
        ).toBeInTheDocument();
    });

    it('should render a disabled deposit collateral button when chainError', async () => {
        await waitFor(() =>
            render(<NotEnoughCollateral />, {
                preloadedState: {
                    ...preloadedState,
                    landingOrderForm: {
                        ...preloadedState.landingOrderForm,
                        amount: '6000000000',
                    },
                    blockchain: {
                        chainError: true,
                    },
                },
            })
        );
        expect(
            await screen.findByTestId('deposit-collateral-button')
        ).toBeInTheDocument();
        expect(
            screen.getByText('Deposit collateral to borrow')
        ).toBeInTheDocument();
        expect(screen.getByTestId('deposit-collateral-button')).toBeDisabled();
    });

    it('should render place order button when collateral is sufficient for order and emit place order button event when clicked', async () => {
        await waitFor(() => {
            render(<EnoughCollateral />, { preloadedState });
        });
        expect(
            await screen.findByTestId('place-order-button')
        ).toBeInTheDocument();
        const button = screen.getByTestId('place-order-button');
        await waitFor(() => expect(button).toBeEnabled());
        fireEvent.click(button);
        expect(track).toHaveBeenCalledWith(ButtonEvents.PLACE_ORDER_BUTTON);
        expect(
            screen.getByRole('dialog', { name: 'Confirm Borrow' })
        ).toBeInTheDocument();
    });

    it('should render a disabled place order button when chainError', async () => {
        await waitFor(() => {
            render(<EnoughCollateral />, {
                preloadedState: {
                    ...preloadedState,
                    blockchain: {
                        chainError: true,
                    },
                },
            });
        });
        expect(
            await screen.findByTestId('place-order-button')
        ).toBeInTheDocument();
        const button = screen.getByTestId('place-order-button');
        await waitFor(() => expect(button).toBeDisabled());
    });

    it('should render order side on the place order button if provided as props', async () => {
        await waitFor(() =>
            render(<RenderOrderSideButton />, { preloadedState })
        );
        expect(
            await screen.findByTestId('place-order-button')
        ).toBeInTheDocument();
        expect(screen.getByText('Borrow')).toBeInTheDocument();
    });

    it('should render place order button as it is', async () => {
        await waitFor(() =>
            render(<EnoughCollateral renderSide={false} />, { preloadedState })
        );
        expect(
            await screen.findByTestId('place-order-button')
        ).toBeInTheDocument();
        expect(screen.getByText('Place Order')).toBeInTheDocument();
    });

    it('should render place order button if order side is lend', async () => {
        await waitFor(() => {
            render(<NotEnoughCollateral />, {
                preloadedState: {
                    ...preloadedState,
                    landingOrderForm: {
                        ...preloadedState.landingOrderForm,
                        side: OrderSide.LEND,
                    },
                },
            });
        });
        expect(
            await screen.findByTestId('place-order-button')
        ).toBeInTheDocument();
        const button = screen.getByTestId('place-order-button');
        await waitFor(() => expect(button).toBeEnabled());
        fireEvent.click(button);
        expect(
            screen.getByRole('dialog', { name: 'Confirm Lend' })
        ).toBeInTheDocument();
    });

    it('should disable the button if the market is not open or pre-open', async () => {
        const lendingMarkets = await mockSecuredFinance.getOrderBookDetails();
        const marketIndex = lendingMarkets.findIndex(
            value => value.ccy === usdcBytes32 && value.name === 'DEC22'
        );
        const market = lendingMarkets[marketIndex];
        lendingMarkets[marketIndex] = {
            ...market,
            isItayosePeriod: true,
            isPreOrderPeriod: false,
            isOpened: false,
        };
        mockSecuredFinance.getOrderBookDetails.mockResolvedValueOnce(
            lendingMarkets
        );

        render(<EnoughCollateral />, { preloadedState });

        await waitFor(async () =>
            expect(
                await screen.findByTestId('place-order-button')
            ).toBeDisabled()
        );
    });
});
