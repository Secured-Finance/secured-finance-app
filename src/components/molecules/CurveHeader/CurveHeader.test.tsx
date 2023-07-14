import { composeStories } from '@storybook/react';
import { preloadedAssetPrices } from 'src/stories/mocks/fixtures';
import { render, screen } from 'src/test-utils.js';
import { CurrencySymbol } from 'src/utils';
import * as stories from './CurveHeader.stories';

const { Default } = composeStories(stories);

describe('CurveHeader component', () => {
    const preloadedState = { ...preloadedAssetPrices };

    it('should render CurveHeader', () => {
        render(<Default />);
    });

    it('should display the full name of the asset', () => {
        render(<Default />);
        expect(screen.getByText('Filecoin')).toBeInTheDocument();
    });

    it('should display the price of the asset', () => {
        render(<Default />, {
            preloadedState,
        });
        expect(screen.getByText('$6.00')).toBeInTheDocument();
    });

    it('should display the change of the asset and round up the second decimal', () => {
        render(<Default />, {
            preloadedState,
        });
        expect(screen.getByText('-8.21%')).toBeInTheDocument();
    });

    it('should display Total Volume (Asset) for EFIL and Total Volume (USD) when asset is EFIL', () => {
        render(<Default />, {
            preloadedState,
        });

        assertAssetVolume('300 EFIL', '$1,800');
    });

    it('should display Total Volume (Asset) for USDC and Total Volume (USD) when asset is USDC', () => {
        render(<Default asset={CurrencySymbol.USDC} />, {
            preloadedState,
        });
        assertAssetVolume('0 USDC', '$0');
    });

    it('should display Total Volume (Asset) for ETH and Total Volume (USD) when asset is ETH', () => {
        render(<Default asset={CurrencySymbol.ETH} />, {
            preloadedState,
        });
        assertAssetVolume('0 ETH', '$0');
    });

    it('should display Total Volume (Asset) for WBTC and Total Volume (USD) when asset is WBTC', () => {
        render(<Default asset={CurrencySymbol.WBTC} />, {
            preloadedState,
        });
        assertAssetVolume('0 WBTC', '$0');
    });
});

const assertAssetVolume = (assetVolume: string, usdVolume: string) => {
    expect(screen.getByText('Total Volume (Asset)')).toBeInTheDocument();
    expect(screen.getByText(assetVolume)).toBeInTheDocument();
    expect(screen.getByText('Total Volume (USD)')).toBeInTheDocument();
    expect(screen.getByText(usdVolume)).toBeInTheDocument();
};
