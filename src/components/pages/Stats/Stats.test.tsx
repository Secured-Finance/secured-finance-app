import { composeStories } from '@storybook/react';
import { preloadedBalance } from 'src/stories/mocks/fixtures';
import { mockUseSF } from 'src/stories/mocks/useSFMock';
import {
    render,
    screen,
    waitFor,
    cleanupGraphQLMocks,
} from 'src/test-utils.js';
import graphqlMocks from 'src/test-utils/mockData';
import * as stories from './Stats.stories';

const { Default, ConnectedToWallet } = composeStories(stories);

// Mock the UserCountAndVolume hook to avoid GraphQL query issues
jest.mock('src/generated/subgraph', () => ({
    ...jest.requireActual('src/generated/subgraph'),
    useUserCountAndVolumeQuery: jest.fn(() => ({
        data: {
            protocol: {
                totalUsers: '12150',
                volumesByCurrency: [
                    {
                        currency:
                            '0x555344430000000000000000000000000000000000000000000000000000000', // USDC
                        totalVolume: '1000000000000000000000',
                    },
                    {
                        currency:
                            '0x5746494c00000000000000000000000000000000000000000000000000000000', // WFIL
                        totalVolume: '500000000000000000000',
                    },
                ],
            },
        },
        isLoading: false,
        error: null,
    })),
}));

jest.mock('next/router', () => ({
    useRouter: jest.fn(() => ({
        pathname: '/',
        push: jest.fn(),
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

const renderDefault = async () => {
    await waitFor(() =>
        render(<Default />, {
            graphqlMocks: graphqlMocks.withTransactions,
            preloadedState: {
                ...preloadedBalance,
            },
        })
    );
};

const renderConnected = async () => {
    await waitFor(() =>
        render(<ConnectedToWallet />, {
            graphqlMocks: graphqlMocks.withTransactions,
            preloadedState: {
                ...preloadedBalance,
            },
        })
    );
};

describe('MarketDashboard Component', () => {
    afterEach(() => {
        cleanupGraphQLMocks();
    });
    it('should render MarketDashboard', async () => {
        await renderDefault();
    });

    it.skip('should render the total users', async () => {
        await renderDefault();
        await waitFor(
            async () =>
                expect(await screen.findByText('12.15K')).toBeInTheDocument(),
            {
                timeout: 8000,
            }
        );
    }, 8000);

    it.skip('should show the yield curves', async () => {
        await renderDefault();
        const yieldCurves = await screen.findAllByTestId('curve-chip');
        expect(yieldCurves).toHaveLength(4);
    });

    it.skip('should render the collateral widget when connected', async () => {
        await renderConnected();
        const collateralWidget = await screen.findByText(
            'Collateral Utilization'
        );
        expect(collateralWidget).toBeInTheDocument();
    }, 10000); //TODO: TEST THROWS TIMEOUT EXCEEDED WARNING ON GITHUB ACTIONS

    it('should show delisting disclaimer if a currency is being delisted', async () => {
        await renderDefault();
        await waitFor(() => {
            expect(
                screen.getByText(
                    'Please note that USDC will be delisted on Secured Finance.'
                )
            ).toBeInTheDocument();
        });
    }, 8000);

    it('should not show delisting disclaimer if no currency is being delisted', async () => {
        jest.spyOn(mock, 'currencyExists').mockResolvedValue(true);
        await renderDefault();
        await waitFor(() => {
            expect(
                screen.queryByText(
                    'Please note that USDC will be delisted on Secured Finance.'
                )
            ).not.toBeInTheDocument();
        });
    });
});
