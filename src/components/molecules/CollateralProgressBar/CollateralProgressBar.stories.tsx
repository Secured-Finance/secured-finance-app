import { ComponentMeta, ComponentStory } from '@storybook/react';
import { CollateralProgressBar } from './CollateralProgressBar';

export default {
    title: 'Molecules/CollateralProgressBar',
    component: CollateralProgressBar,
    args: {
        collateralAmount: 4440,
        totalCollateral: 12000,
    },
} as ComponentMeta<typeof CollateralProgressBar>;

const Template: ComponentStory<typeof CollateralProgressBar> = args => (
    <CollateralProgressBar {...args} />
);

export const Default = Template.bind({});
