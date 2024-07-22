import { RESPONSIVE_PARAMETERS, VIEWPORTS } from '.storybook/constants';
import type { Meta, StoryFn } from '@storybook/react';
import { withWalletProvider } from 'src/../.storybook/decorators';
import { emptyCollateralBook } from 'src/hooks';
import { collateralBook80, zcBonds } from 'src/stories/mocks/fixtures';
import { CollateralTab } from './CollateralTab';

export default {
    title: 'Organism/CollateralTab',
    component: CollateralTab,
    args: {
        collateralBook: emptyCollateralBook,
        netAssetValue: 0,
        zcBonds: [],
    },
    parameters: {
        ...RESPONSIVE_PARAMETERS,
        chromatic: {
            viewports: [VIEWPORTS.MOBILE, VIEWPORTS.TABLET],
        },
        layout: 'fullscreen',
    },
    decorators: [withWalletProvider],
} as Meta<typeof CollateralTab>;

const Template: StoryFn<typeof CollateralTab> = args => {
    return <CollateralTab {...args} />;
};

export const Default = Template.bind({});
export const ConnectedToWallet = Template.bind({});
ConnectedToWallet.parameters = {
    connected: true,
};

ConnectedToWallet.args = {
    collateralBook: collateralBook80,
    netAssetValue: 12700.34,
    zcBonds,
};
