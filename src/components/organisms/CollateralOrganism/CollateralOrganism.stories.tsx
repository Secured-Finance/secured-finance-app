import type { Meta, StoryFn } from '@storybook/react';
import { withWalletProvider } from 'src/../.storybook/decorators';
import { emptyCollateralBook } from 'src/hooks';
import { collateralBook37, zcBonds } from 'src/stories/mocks/fixtures';
import { CollateralOrganism } from './CollateralOrganism';

export default {
    title: 'Organism/CollateralOrganism',
    component: CollateralOrganism,
    args: {
        collateralBook: emptyCollateralBook,
        netAssetValue: 0,
        zcBonds: [],
    },
    decorators: [withWalletProvider],
} as Meta<typeof CollateralOrganism>;

const Template: StoryFn<typeof CollateralOrganism> = args => (
    <CollateralOrganism {...args} />
);

export const NotConnectedToWallet = Template.bind({});

export const ConnectedToWallet = Template.bind({});
ConnectedToWallet.parameters = {
    connected: true,
    chromatic: { delay: 500 },
};
ConnectedToWallet.args = {
    collateralBook: collateralBook37,
    netAssetValue: 12700.34,
    zcBonds,
};
