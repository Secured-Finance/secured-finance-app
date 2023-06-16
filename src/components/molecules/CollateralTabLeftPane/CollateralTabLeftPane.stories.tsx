import { RESPONSIVE_PARAMETERS, VIEWPORTS } from '.storybook/constants';
import { ComponentMeta, ComponentStory } from '@storybook/react';
import {
    withAssetPrice,
    withWalletProvider,
} from 'src/../.storybook/decorators';
import {
    collateralBook80,
    emptyUSDCollateral,
} from 'src/stories/mocks/fixtures';
import { CollateralTabLeftPane } from './CollateralTabLeftPane';

export default {
    title: 'Molecules/CollateralTabLeftPane',
    component: CollateralTabLeftPane,
    args: {
        account: 'as',
        onClick: () => {},
        collateralBook: collateralBook80,
    },
    parameters: {
        ...RESPONSIVE_PARAMETERS,
        chromatic: {
            viewports: [VIEWPORTS.MOBILE, VIEWPORTS.TABLET],
        },
    },
    decorators: [withAssetPrice, withWalletProvider],
} as ComponentMeta<typeof CollateralTabLeftPane>;

const Template: ComponentStory<typeof CollateralTabLeftPane> = args => {
    return <CollateralTabLeftPane {...args} />;
};

export const Default = Template.bind({});

export const NotConnectedToWallet = Template.bind({});
NotConnectedToWallet.args = {
    account: null,
    onClick: () => {},
};

export const EmptyUSDCollateralBalance = Template.bind({});
EmptyUSDCollateralBalance.args = {
    account: 'as',
    onClick: () => {},
    collateralBook: emptyUSDCollateral,
};
