import { RESPONSIVE_PARAMETERS, VIEWPORTS } from '.storybook/constants';
import { ComponentMeta, ComponentStory } from '@storybook/react';
import { CollateralProgressBar } from './CollateralProgressBar';

export default {
    title: 'Molecules/CollateralProgressBar',
    component: CollateralProgressBar,
    args: {
        collateralCoverage: 0,
        totalCollateralInUSD: 0,
        collateralThreshold: 80,
    },
    parameters: {
        ...RESPONSIVE_PARAMETERS,
        chromatic: {
            viewports: [VIEWPORTS.MOBILE, VIEWPORTS.TABLET],
        },
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
    collateralThreshold: 80,
};
