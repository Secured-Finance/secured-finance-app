import { ComponentMeta, ComponentStory } from '@storybook/react';
import { CollateralProgressBar } from './CollateralProgressBar';

export default {
    title: 'Molecules/CollateralProgressBar',
    component: CollateralProgressBar,
    args: {
        collateralCoverage: 0,
        totalCollateralInUSD: 0,
    },
} as ComponentMeta<typeof CollateralProgressBar>;

const Template: ComponentStory<typeof CollateralProgressBar> = args => (
    <CollateralProgressBar {...args} />
);

export const Default = Template.bind({});
export const ConnectedToWallet = Template.bind({});
ConnectedToWallet.args = {
    collateralCoverage: 37,
    totalCollateralInUSD: 100,
};
