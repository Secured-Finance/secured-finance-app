import { ComponentMeta, ComponentStory } from '@storybook/react';
import {
    withMaturities,
    withWalletProvider,
} from 'src/../.storybook/decorators';
import { maturityOptions, yieldCurveRates } from 'src/stories/mocks/fixtures';
import { AdvancedLendingOrganism } from './AdvancedLendingOrganism';

export default {
    title: 'Organism/AdvancedLendingOrganism',
    component: AdvancedLendingOrganism,
    chromatic: { pauseAnimationAtEnd: true },
    args: {
        maturitiesOptionList: maturityOptions,
        rates: yieldCurveRates,
    },
    parameters: {
        date: { tick: true },
    },
    decorators: [withWalletProvider, withMaturities],
} as ComponentMeta<typeof AdvancedLendingOrganism>;

const Template: ComponentStory<typeof AdvancedLendingOrganism> = args => {
    return <AdvancedLendingOrganism {...args} />;
};

export const Default = Template.bind({});
