import { RESPONSIVE_PARAMETERS, VIEWPORTS } from '.storybook/constants';
import { ComponentMeta, ComponentStory } from '@storybook/react';
import {
    withAssetPrice,
    withWalletProvider,
} from 'src/../.storybook/decorators';
import { collateralBook80, emptyBook } from 'src/stories/mocks/fixtures';
import { CollateralTab } from './CollateralTab';

export default {
    title: 'Organism/CollateralTab',
    component: CollateralTab,
    args: {
        collateralBook: emptyBook,
    },
    parameters: {
        ...RESPONSIVE_PARAMETERS,
        chromatic: {
            viewports: [VIEWPORTS.MOBILE, VIEWPORTS.TABLET],
        },
        layout: 'fullscreen',
    },
    decorators: [withWalletProvider, withAssetPrice],
} as ComponentMeta<typeof CollateralTab>;

const Template: ComponentStory<typeof CollateralTab> = args => {
    return <CollateralTab {...args} />;
};

export const Default = Template.bind({});
export const ConnectedToWallet = Template.bind({});
ConnectedToWallet.parameters = {
    connected: true,
};

ConnectedToWallet.args = {
    collateralBook: collateralBook80,
};
