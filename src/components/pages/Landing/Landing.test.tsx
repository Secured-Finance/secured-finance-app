import { OrderSide } from '@secured-finance/sf-client';
import { composeStories } from '@storybook/react';
import { zeroRates } from 'src/hooks/useYieldCurveHistoricalRates/constant';
import {
    dec22Fixture,
    mar23Fixture,
    maturities,
} from 'src/stories/mocks/fixtures';
import { initialStore } from 'src/stories/mocks/mockStore';
import { mockUseSF } from 'src/stories/mocks/useSFMock';
import { fireEvent, render, screen, waitFor, within } from 'src/test-utils.js';
import { OrderType } from 'src/types';
import { CurrencySymbol } from 'src/utils';
import timemachine from 'timemachine';
import { WithBanner } from './Landing';
import * as stories from './Landing.stories';

const { Default, AdvancedViewConnected } = composeStories(stories);

jest.mock('next/router', () => ({
    useRouter: jest.fn(() => ({
        pathname: '/',
        push: jest.fn(),
        query: { market: 'WBTC-DEC2024' },
    })),
}));

jest.mock(
    'next/link',
    () =>
        ({ children }: { children: React.ReactNode }) =>
            children
);

const mock = mockUseSF();
jest.mock('src/hooks/useSecuredFinance', () => () => mock);
jest.mock('src/hooks/useYieldCurveHistoricalRates', () => ({
    useYieldCurveMarketRatesHistorical: jest.fn(() => ({
        historicalRates: zeroRates,
        loading: false,
    })),
}));

const preloadedState = {
    ...initialStore,
    wallet: { address: '0x1' },
};

const baseLendingMarkets = {
    [CurrencySymbol.aUSDC]: {
        [dec22Fixture.toNumber()]: maturities[dec22Fixture.toNumber()],
    },
} as Record<CurrencySymbol, Record<number, (typeof maturities)[number]>>;

const baseWithBannerProps = {
    ccy: CurrencySymbol.aUSDC,
    maturity: dec22Fixture.toNumber(),
    market: maturities[dec22Fixture.toNumber()],
    lendingMarkets: baseLendingMarkets,
    delistedCurrencySet: new Set<CurrencySymbol>(),
    children: <div>Banner Child Example</div>,
    isItayose: false,
    maximumOpenOrderLimit: undefined,
    preOrderDays: undefined,
};

beforeAll(() => {
    timemachine.reset();
    timemachine.config({
        dateString: '2021-12-01T11:00:00.00Z',
    });
});

describe('Landing Component', () => {
    const changeInputValue = (label: string, value: string) => {
        const input = screen.getByLabelText(label);
        fireEvent.change(input, { target: { value } });
        expect(input).toHaveValue(value);
    };

    const assertInputValue = (label: string, value: string) => {
        const input = screen.getByLabelText(label);
        expect(input).toHaveValue(value);
    };

    it.skip('should change the rate when the user changes the maturity', async () => {
        render(<Default />, {
            apolloMocks: Default.parameters?.apolloClient.mocks,
            preloadedState: {
                ...preloadedState,
                landingOrderForm: {
                    currency: CurrencySymbol.WFIL,
                    maturity: 1669852800,
                    side: OrderSide.BORROW,
                    amount: '500000000',
                    unitPrice: 9500,
                    orderType: OrderType.LIMIT,
                    marketPhase: 'Open',
                },
            },
        });
        expect(
            await within(screen.getByTestId('market-rate')).findByText('3.26%')
        ).toBeInTheDocument();

        fireEvent.click(screen.getByRole('button', { name: 'DEC2022' }));
        fireEvent.click(screen.getByText('MAR2023'));
        expect(screen.getByTestId('market-rate')).toHaveTextContent('2.62%');
    });

    it('should default to limit order type when the user goes to advanced mode', async () => {
        waitFor(() => {
            render(<AdvancedViewConnected />, {
                apolloMocks: Default.parameters?.apolloClient.mocks,
                preloadedState,
            });
        });

        expect(screen.getByRole('radio', { name: 'Limit' })).toBeChecked();
        expect(screen.getByRole('radio', { name: 'Market' })).not.toBeChecked();
    });

    it('should select the market order type when the user clicks on market tab', async () => {
        waitFor(() => {
            render(<AdvancedViewConnected />, {
                apolloMocks: Default.parameters?.apolloClient.mocks,
                preloadedState,
            });
        });

        expect(screen.getByRole('radio', { name: 'Limit' })).toBeChecked();

        fireEvent.click(screen.getByRole('radio', { name: 'Market' }));
        expect(screen.getByRole('radio', { name: 'Market' })).toBeChecked();
    });

    describe('Bond Price field', () => {
        it.skip('should display the best price as bond price when user gets to advanced mode', async () => {
            await waitFor(() => {
                render(<Default />, {
                    apolloMocks: Default.parameters?.apolloClient.mocks,
                    preloadedState,
                });
            });

            await waitFor(() =>
                expect(screen.getByText('DEC2022')).toBeInTheDocument()
            );
            assertInputValue('Amount', '');
            assertInputValue('Bond Price', '96.85');
        });

        it.skip('should reset bond price when user changes maturity', async () => {
            await waitFor(() => {
                render(<Default />, {
                    apolloMocks: Default.parameters?.apolloClient.mocks,
                    preloadedState,
                });
            });

            expect(await screen.findByText('DEC2022')).toBeInTheDocument();

            assertInputValue('Bond Price', '96.85');

            changeInputValue('Amount', '1');
            changeInputValue('Bond Price', '80');

            fireEvent.click(screen.getByRole('button', { name: 'DEC2022' }));
            fireEvent.click(screen.getByText('MAR2023'));
            expect(await screen.findByText('MAR2023')).toBeInTheDocument();

            assertInputValue('Amount', '1');
            assertInputValue('Bond Price', '96.83');
        });

        it.skip('should reset bond price to the best price when user changes currency', async () => {
            await waitFor(() => {
                render(<Default />, {
                    apolloMocks: Default.parameters?.apolloClient.mocks,
                    preloadedState,
                });
            });

            await waitFor(() =>
                expect(
                    screen.getByRole('button', { name: 'DEC2022' })
                ).toBeInTheDocument()
            );

            // ensure wallet is connected
            await waitFor(() => {
                expect(screen.getByLabelText('Bond Price')).toBeInTheDocument();
            });

            assertInputValue('Bond Price', '96.85');

            changeInputValue('Amount', '1');
            changeInputValue('Bond Price', '80');

            fireEvent.click(screen.getByRole('button', { name: 'WFIL' }));
            fireEvent.click(screen.getByRole('menuitem', { name: 'USDC' }));

            assertInputValue('Amount', '1');
            assertInputValue('Bond Price', '96.85');
        }, 8000);
    });

    it.skip('should filter out non ready markets', async () => {
        await waitFor(() => {
            render(<Default />, {
                apolloMocks: Default.parameters?.apolloClient.mocks,
                preloadedState,
            });
        });

        expect(await screen.findByText('DEC2022')).toBeInTheDocument();

        fireEvent.click(screen.getByText('DEC2022'));
        expect(screen.getByText('MAR2023')).toBeInTheDocument();
        expect(screen.queryByText('DEC2024')).not.toBeInTheDocument();
    });

    it.skip('should change the amount slider when amount input changes and user has balance', async () => {
        await waitFor(() => {
            render(<AdvancedViewConnected />, {
                apolloMocks: Default.parameters?.apolloClient.mocks,
                preloadedState,
            });
        });
        expect(await screen.findByText('DEC2022')).toBeInTheDocument();
        expect(screen.getByRole('slider')).toHaveValue('0');
        fireEvent.click(screen.getByRole('radio', { name: 'Lend' }));
        await waitFor(() =>
            fireEvent.input(screen.getByRole('textbox', { name: 'Size' }), {
                target: { value: '1000' },
            })
        );
        expect(screen.getByRole('slider')).toHaveValue('10');
        await waitFor(() =>
            fireEvent.input(screen.getByRole('textbox', { name: 'Size' }), {
                target: { value: '5000' },
            })
        );
        await waitFor(() =>
            expect(screen.getByRole('slider')).toHaveValue('50')
        );
    });

    it.skip('should not change the amount slider when amount input changes and user do not have balance', async () => {
        await waitFor(() => {
            render(<AdvancedViewConnected />, {
                apolloMocks: Default.parameters?.apolloClient.mocks,
                preloadedState,
            });
        });
        expect(await screen.findByText('DEC2022')).toBeInTheDocument();
        expect(screen.getByRole('slider')).toHaveValue('0');
        waitFor(() => {
            fireEvent.change(screen.getByRole('textbox', { name: 'Size' }), {
                target: { value: '100' },
            });
        });

        expect(screen.getByRole('slider')).toHaveValue('0');
    });

    it.skip('should show delisting disclaimer if a currency is being delisted', async () => {
        await waitFor(() => {
            render(<Default />, {
                apolloMocks: Default.parameters?.apolloClient.mocks,
                preloadedState,
            });
        });

        await waitFor(() => {
            expect(
                screen.getByText(
                    'Please note that USDC will be delisted on Secured Finance.'
                )
            ).toBeInTheDocument();
        });
    });

    it.skip('should not show delisting disclaimer if no currency is being delisted', async () => {
        // This test fails sometimes only when all test suites are run.
        jest.spyOn(mock, 'currencyExists').mockResolvedValue(true);
        await waitFor(() => {
            render(<Default />, {
                apolloMocks: Default.parameters?.apolloClient.mocks,
                preloadedState,
            });
        });

        await waitFor(() => {
            expect(
                screen.queryByText(
                    'Please note that USDC will be delisted on Secured Finance.'
                )
            ).not.toBeInTheDocument();
        });
    });

    it.skip('should render the itayose banner for opening of a new market', async () => {
        await waitFor(() => {
            render(<Default />, {
                apolloMocks: Default.parameters?.apolloClient.mocks,
                preloadedState,
            });
        });

        await waitFor(() => {
            expect(
                screen.getByText(
                    'Market WFIL-DEC2024 is open for pre-orders now until May 31, 2023 23:00 (UTC)'
                )
            ).toBeInTheDocument();
        });
    }, 8000);

    it('should render the welcome message alert', () => {
        render(<Default />, {
            apolloMocks: Default.parameters?.apolloClient.mocks,
            preloadedState,
        });

        expect(
            screen.getByText('Welcome! Please deposit funds to enable trading.')
        ).toBeInTheDocument();
    });

    it('shows warning when maximumOpenOrderLimit is true', () => {
        render(
            <WithBanner {...baseWithBannerProps} maximumOpenOrderLimit={true} />
        );
        expect(
            screen.getByText(
                /you currently have the maximum number of 20 orders/i
            )
        ).toBeInTheDocument();
    });

    it('shows info when isItayose and preOrderDays are set', () => {
        render(
            <WithBanner
                {...baseWithBannerProps}
                isItayose={true}
                preOrderDays={5}
            />
        );
        expect(
            screen.getByText(
                /secure your market position by placing limit orders up to 5 days before trading begins/i
            )
        ).toBeInTheDocument();
        expect(screen.getByText(/Secured Finance Docs/)).toBeInTheDocument();
    });

    it('shows info when market is open for pre-orders and not itayose', () => {
        render(<WithBanner {...baseWithBannerProps} isItayose={false} />);
        expect(
            screen.getByText(/Market aUSDC-.*is open for pre-orders now until/i)
        ).toBeInTheDocument();
        expect(screen.getByText(/Place Order Now/)).toBeInTheDocument();
    });

    describe('Auto-roll banner', () => {
        const AUTO_ROLL_TEXT =
            /When this order book reaches maturity, any open positions will/i;
        const DAY_IN_SECONDS = 24 * 60 * 60;

        const createLendingMarkets = (
            earliestMaturity: number,
            isOpened = true,
            isMatured = false,
            additionalMarkets?: Record<
                CurrencySymbol,
                Record<number, (typeof maturities)[number]>
            >
        ) =>
            ({
                [CurrencySymbol.aUSDC]: {
                    [earliestMaturity]: {
                        ...maturities[dec22Fixture.toNumber()],
                        maturity: earliestMaturity,
                        isOpened,
                        isMatured,
                    },
                    [mar23Fixture.toNumber()]: {
                        ...maturities[mar23Fixture.toNumber()],
                        isOpened: true,
                        isMatured: false,
                    },
                },
                ...(additionalMarkets || {}),
            } as Record<
                CurrencySymbol,
                Record<number, (typeof maturities)[number]>
            >);

        const renderWithMaturity = (
            daysFromNow: number,
            options?: {
                maturity?: number;
                lendingMarkets?: Record<
                    CurrencySymbol,
                    Record<number, (typeof maturities)[number]>
                >;
                isOpened?: boolean;
                isMatured?: boolean;
                market?: (typeof maturities)[number];
            }
        ) => {
            const maturity =
                options?.maturity ??
                Math.floor(Date.now() / 1000) + daysFromNow * DAY_IN_SECONDS;
            const lendingMarkets =
                options?.lendingMarkets ??
                createLendingMarkets(
                    maturity,
                    options?.isOpened,
                    options?.isMatured
                );

            render(
                <WithBanner
                    {...baseWithBannerProps}
                    maturity={maturity}
                    market={options?.market}
                    lendingMarkets={lendingMarkets}
                />
            );
        };

        it('shows auto-roll banner when market is earliest maturing and within 7 days', () => {
            renderWithMaturity(5);

            expect(screen.getByText(AUTO_ROLL_TEXT)).toBeInTheDocument();
            expect(
                screen.getByText(/into the next 3-month term/i)
            ).toBeInTheDocument();
            expect(
                screen.getByText(/This helps mitigate reinvestment risk/i)
            ).toBeInTheDocument();
        });

        it('shows auto-roll banner with clickable auto-roll link', () => {
            renderWithMaturity(3);

            const autoRollLink = screen.getByText('auto-roll');
            expect(autoRollLink.closest('a')).toHaveAttribute(
                'href',
                'https://docs.secured.finance/fixed-rate-lending/advanced-topics/market-dynamics/auto-rolling'
            );
        });

        it.each([
            ['more than 7 days before maturity', 10, undefined],
            ['maturity has passed', -1, undefined],
            ['market is not opened', 5, { isOpened: false }],
            ['market is matured', 5, { isMatured: true }],
        ])('does not show auto-roll banner when %s', (_, days, options) => {
            renderWithMaturity(days, options);
            expect(screen.queryByText(AUTO_ROLL_TEXT)).not.toBeInTheDocument();
        });

        it('does not show auto-roll banner when current market is not the earliest maturing', () => {
            const earliestMaturity =
                Math.floor(Date.now() / 1000) + 5 * DAY_IN_SECONDS;
            renderWithMaturity(5, {
                maturity: mar23Fixture.toNumber(),
                lendingMarkets: createLendingMarkets(earliestMaturity),
            });
            expect(screen.queryByText(AUTO_ROLL_TEXT)).not.toBeInTheDocument();
        });

        it('does not show auto-roll banner when current currency is not the earliest maturing', () => {
            const earliestMaturity =
                Math.floor(Date.now() / 1000) + 5 * DAY_IN_SECONDS;
            renderWithMaturity(5, {
                lendingMarkets: {
                    ...createLendingMarkets(earliestMaturity),
                    [CurrencySymbol.WFIL]: {
                        [earliestMaturity - DAY_IN_SECONDS]: {
                            ...maturities[dec22Fixture.toNumber()],
                            maturity: earliestMaturity - DAY_IN_SECONDS,
                            isOpened: true,
                            isMatured: false,
                        },
                    },
                },
            });
            expect(screen.queryByText(AUTO_ROLL_TEXT)).not.toBeInTheDocument();
        });

        it('shows auto-roll banner below pre-open order notification when both are present', () => {
            const earliestMaturity =
                Math.floor(Date.now() / 1000) + 5 * DAY_IN_SECONDS;
            renderWithMaturity(5, {
                market: {
                    ...maturities[dec22Fixture.toNumber()],
                    maturity: earliestMaturity,
                    isPreOrderPeriod: true,
                },
            });

            const preOrderText = screen.getByText(
                /Market aUSDC-.*is open for pre-orders now until/i
            );
            const autoRollText = screen.getByText(AUTO_ROLL_TEXT);
            const preOrderAlert = preOrderText.closest('[role="alert"]');
            const autoRollAlert = autoRollText.closest('[role="alert"]');

            expect(preOrderText).toBeInTheDocument();
            expect(autoRollText).toBeInTheDocument();
            if (preOrderAlert && autoRollAlert) {
                expect(
                    preOrderAlert.compareDocumentPosition(autoRollAlert) &
                        Node.DOCUMENT_POSITION_FOLLOWING
                ).toBeTruthy();
            }
        });

        it.each([
            ['exactly 7 days before maturity', 7],
            ['exactly 0 days (at maturity)', 0],
        ])('shows auto-roll banner at %s', (_, days) => {
            renderWithMaturity(days);
            expect(screen.getByText(AUTO_ROLL_TEXT)).toBeInTheDocument();
        });
    });
});
