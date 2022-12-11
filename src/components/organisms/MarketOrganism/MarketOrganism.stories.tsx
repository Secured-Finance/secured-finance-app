import { ComponentMeta, ComponentStory } from '@storybook/react';
import {
    withMaturities,
    withWalletProvider,
} from 'src/../.storybook/decorators';
import { maturityOptions } from 'src/stories/mocks/fixtures';
import { MarketOrganism } from './MarketOrganism';

export default {
    title: 'Organism/MarketOrganism',
    component: MarketOrganism,
    args: {
        maturitiesOptionList: maturityOptions,
    },
    decorators: [withWalletProvider, withMaturities],
} as ComponentMeta<typeof MarketOrganism>;

const Template: ComponentStory<typeof MarketOrganism> = args => {
    return <MarketOrganism {...args} />;
};

export const Default = Template.bind({});
