import { RESPONSIVE_PARAMETERS, VIEWPORTS } from '.storybook/constants';
import { withWalletProvider } from '.storybook/decorators';
import type { Meta, StoryFn } from '@storybook/react';
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
        netAssetValue: 12700.34,
    },
    parameters: {
        ...RESPONSIVE_PARAMETERS,
        chromatic: {
            viewports: [VIEWPORTS.MOBILE, VIEWPORTS.TABLET],
        },
    },
    decorators: [withWalletProvider],
} as Meta<typeof CollateralTabLeftPane>;

const Template: StoryFn<typeof CollateralTabLeftPane> = args => {
    return <CollateralTabLeftPane {...args} />;
};

export const Default = Template.bind({});

export const NotConnectedToWallet = Template.bind({});
NotConnectedToWallet.args = {
    account: undefined,
    onClick: () => {},
    netAssetValue: 0,
};

export const EmptyUSDCollateralBalance = Template.bind({});
EmptyUSDCollateralBalance.args = {
    account: 'as',
    onClick: () => {},
    collateralBook: emptyUSDCollateral,
    netAssetValue: 600,
};
