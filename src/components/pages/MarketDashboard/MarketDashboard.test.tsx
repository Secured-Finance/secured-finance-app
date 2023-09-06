import { composeStories } from '@storybook/react';
import {
    preloadedAssetPrices,
    preloadedEthBalance,
} from 'src/stories/mocks/fixtures';
import { render, screen, waitFor } from 'src/test-utils.js';
import * as stories from './MarketDashboard.stories';

const { Default, ConnectedToWallet } = composeStories(stories);

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

const renderDefault = async () => {
    await waitFor(() =>
        render(<Default />, {
            apolloMocks: Default.parameters?.apolloClient.mocks,
            preloadedState: {
                ...preloadedEthBalance,
                ...preloadedAssetPrices,
            },
        })
    );
};

const renderConnected = async () => {
    await waitFor(() =>
        render(<ConnectedToWallet />, {
            apolloMocks: ConnectedToWallet.parameters?.apolloClient.mocks,
            preloadedState: {
                ...preloadedEthBalance,
                ...preloadedAssetPrices,
            },
        })
    );
};

describe('MarketDashboard Component', () => {
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

    it('should show the yield curves', async () => {
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
});
