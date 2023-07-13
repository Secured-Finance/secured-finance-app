import { OrderSide } from '@secured-finance/sf-client';
import { ComponentMeta, ComponentStory } from '@storybook/react';
import { collateralBook37, dec22Fixture } from 'src/stories/mocks/fixtures';
import { CurrencySymbol } from 'src/utils';
import { Amount, LoanValue } from 'src/utils/entities';
import { CollateralSimulationSection } from './CollateralSimulationSection';

export default {
    title: 'Organism/CollateralSimulationSection',
    component: CollateralSimulationSection,
    args: {
        collateral: collateralBook37,
        tradeAmount: new Amount('50000000000000000000', CurrencySymbol.WFIL),
        side: OrderSide.BORROW,
        assetPrice: 10,
        tradeValue: LoanValue.fromPrice(9800, dec22Fixture.toNumber()),
    },
} as ComponentMeta<typeof CollateralSimulationSection>;

const Template: ComponentStory<typeof CollateralSimulationSection> = args => (
    <CollateralSimulationSection {...args} />
);

export const Trade = Template.bind({});
