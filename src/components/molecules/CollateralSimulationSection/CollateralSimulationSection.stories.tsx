import { withWalletProvider } from '.storybook/decorators';
import { OrderSide } from '@secured-finance/sf-client';
import type { Meta, StoryFn } from '@storybook/react';
import { collateralBook37, dec22Fixture } from 'src/stories/mocks/fixtures';
import { CurrencySymbol } from 'src/utils';
import { Amount, LoanValue } from 'src/utils/entities';
import { CollateralSimulationSection } from './CollateralSimulationSection';

export default {
    title: 'Organism/CollateralSimulationSection',
    component: CollateralSimulationSection,
    decorators: [withWalletProvider],
    args: {
        collateral: collateralBook37,
        tradeAmount: new Amount('50000000000000000000', CurrencySymbol.WFIL),
        side: OrderSide.BORROW,
        assetPrice: 10,
        tradeValue: LoanValue.fromPrice(9800, dec22Fixture.toNumber()),
    },
    parameters: {
        connected: true,
    },
} as Meta<typeof CollateralSimulationSection>;

const Template: StoryFn<typeof CollateralSimulationSection> = args => (
    <CollateralSimulationSection {...args} />
);

export const Trade = Template.bind({});
