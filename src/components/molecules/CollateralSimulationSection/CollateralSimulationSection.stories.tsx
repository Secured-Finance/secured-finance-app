import { withWalletProvider } from '.storybook/decorators';
import { OrderSide } from '@secured-finance/sf-client';
import type { Meta, StoryFn } from '@storybook/react';
import { useEffect } from 'react';
import { useLandingOrderFormStore } from 'src/store/landingOrderForm';
import { collateralBook37, mar23Fixture } from 'src/stories/mocks/fixtures';
import { CurrencySymbol } from 'src/utils';
import { Amount } from 'src/utils/entities';
import { CollateralSimulationSection } from './CollateralSimulationSection';

export default {
    title: 'Organism/CollateralSimulationSection',
    component: CollateralSimulationSection,
    decorators: [withWalletProvider],
    args: {
        collateral: collateralBook37,
        tradeAmount: new Amount('50000000000000000000', CurrencySymbol.WFIL),
        assetPrice: 6.0,
        side: OrderSide.BORROW,
        maturity: mar23Fixture,
    },
    chromatic: { delay: 1000 },
    parameters: {
        connected: true,
    },
} as Meta<typeof CollateralSimulationSection>;

const Template: StoryFn<typeof CollateralSimulationSection> = args => {
    useEffect(() => {
        const timerId = setTimeout(() => {
            useLandingOrderFormStore
                .getState()
                .setCurrency(CurrencySymbol.WFIL);
            useLandingOrderFormStore
                .getState()
                .setAmount('50000000000000000000');
        }, 200);

        return () => clearTimeout(timerId);
    }, []);

    return <CollateralSimulationSection {...args} />;
};

export const Trade = Template.bind({});
