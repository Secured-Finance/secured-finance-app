import { composeStories } from '@storybook/testing-react';
import { preloadedAssetPrices } from 'src/stories/mocks/fixtures';
import { render, screen } from 'src/test-utils.js';
import { CurrencySymbol } from 'src/utils';
import * as stories from './CurveHeader.stories';

const { Default } = composeStories(stories);

describe('CurveHeader component', () => {
    it('should render CurveHeader', async () => {
        render(<Default />);
    });

    it('should display the full name of the asset', async () => {
        render(<Default />);
        expect(screen.getByText('Filecoin')).toBeInTheDocument();
    });

    it('should display the price of the asset', async () => {
        render(<Default />, {
            preloadedState: {
                ...preloadedAssetPrices,
            },
        });
        expect(screen.getByText('$6.00')).toBeInTheDocument();
    });

    it('should display the change of the asset and round up the second decimal', async () => {
        render(<Default />, {
            preloadedState: {
                ...preloadedAssetPrices,
            },
        });
        expect(screen.getByText('-8.21%')).toBeInTheDocument();
    });

    it('should display Total Volume (Asset) for EFIL and Total Volume (USD) when asset is EFIL', async () => {
        render(<Default />, {
            preloadedState: {
                ...preloadedAssetPrices,
            },
        });

        assertAssetVolume('657,000 EFIL');
    });
    it('should display Total Volume (Asset) for USDC and Total Volume (USD) when asset is USDC', async () => {
        render(<Default asset={CurrencySymbol.USDC} />, {
            preloadedState: {
                ...preloadedAssetPrices,
            },
        });
        assertAssetVolume('0 USDC');
    });
    it('should display Total Volume (Asset) for ETH and Total Volume (USD) when asset is ETH', async () => {
        render(<Default asset={CurrencySymbol.ETH} />, {
            preloadedState: {
                ...preloadedAssetPrices,
            },
        });
        assertAssetVolume('0 ETH');
    });
    it('should display Total Volume (Asset) for WBTC and Total Volume (USD) when asset is WBTC', async () => {
        render(<Default asset={CurrencySymbol.WBTC} />, {
            preloadedState: {
                ...preloadedAssetPrices,
            },
        });
        assertAssetVolume('0 WBTC');
    });
});

const assertAssetVolume = (amount: string) => {
    expect(screen.getByText('Total Volume (Asset)')).toBeInTheDocument();
    expect(screen.getByText(amount)).toBeInTheDocument();
    expect(screen.getByText('Total Volume (USD)')).toBeInTheDocument();
    expect(screen.getByText('$3,942,000')).toBeInTheDocument();
};
