import { composeStories } from '@storybook/react';
import { render, screen } from 'src/test-utils.js';
import { CurrencySymbol } from 'src/utils';
import * as stories from './CurveHeader.stories';

const { Default } = composeStories(stories);

describe('CurveHeader component', () => {
    it('should render CurveHeader', () => {
        render(<Default />);
    });

    it('should display the full name of the asset', () => {
        render(<Default />);
        expect(screen.getByText('Filecoin')).toBeInTheDocument();
    });

    it('should display the price of the asset', async () => {
        render(<Default />);
        expect(await screen.findByText('$6.00')).toBeInTheDocument();
    });

    it('should display Total Volume (Asset) for WFIL and Total Volume (USD) when asset is WFIL', async () => {
        render(<Default />);
        await assertAssetVolume('300 WFIL', '$1,800');
    });

    it('should display Total Volume (Asset) for USDC and Total Volume (USD) when asset is USDC', async () => {
        render(<Default asset={CurrencySymbol.USDC} />);
        await assertAssetVolume('0 USDC', '$0');
    });

    it('should display Total Volume (Asset) for ETH and Total Volume (USD) when asset is ETH', async () => {
        render(<Default asset={CurrencySymbol.ETH} />);
        await assertAssetVolume('0 ETH', '$0');
    });

    it('should display Total Volume (Asset) for WBTC and Total Volume (USD) when asset is WBTC', async () => {
        render(<Default asset={CurrencySymbol.WBTC} />);
        await assertAssetVolume('0 WBTC', '$0');
    });
});

const assertAssetVolume = async (assetVolume: string, usdVolume: string) => {
    expect(screen.getByText('Total Volume (Asset)')).toBeInTheDocument();
    expect(await screen.findByText(assetVolume)).toBeInTheDocument();
    expect(screen.getByText('Total Volume (USD)')).toBeInTheDocument();
    expect(await screen.findByText(usdVolume)).toBeInTheDocument();
};
