import { ComponentMeta, ComponentStory } from '@storybook/react';
import {
    withMaturities,
    withWalletProvider,
} from 'src/../.storybook/decorators';
import { maturityOptions, yieldCurveRates } from 'src/stories/mocks/fixtures';
import { MarketOrganism } from './MarketOrganism';

export default {
    title: 'Organism/MarketOrganism',
    component: MarketOrganism,
    chromatic: { pauseAnimationAtEnd: true },
    args: {
        maturitiesOptionList: maturityOptions,
        rates: yieldCurveRates,
    },
    parameters: {
        date: { tick: true },
    },
    decorators: [withWalletProvider, withMaturities],
} as ComponentMeta<typeof MarketOrganism>;

const Template: ComponentStory<typeof MarketOrganism> = args => {
    return <MarketOrganism {...args} />;
};

export const Default = Template.bind({});
