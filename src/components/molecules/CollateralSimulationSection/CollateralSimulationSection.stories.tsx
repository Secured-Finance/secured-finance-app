import { withWalletProvider } from '.storybook/decorators';
import type { Meta, StoryFn } from '@storybook/react';
import { collateralBook37, dec22Fixture } from 'src/stories/mocks/fixtures';
import { CurrencySymbol } from 'src/utils';
import { Amount } from 'src/utils/entities';
import { CollateralSimulationSection } from './CollateralSimulationSection';

export default {
    title: 'Organism/CollateralSimulationSection',
    component: CollateralSimulationSection,
    decorators: [withWalletProvider],
    args: {
        collateral: collateralBook37,
        maturity: dec22Fixture,
        tradeAmount: new Amount(1000, CurrencySymbol.ETH),
    },
    parameters: {
        connected: true,
    },
} as Meta<typeof CollateralSimulationSection>;

const Template: StoryFn<typeof CollateralSimulationSection> = args => (
    <CollateralSimulationSection {...args} />
);

export const Trade = Template.bind({});
