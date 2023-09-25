import type { Meta, StoryFn } from '@storybook/react';
import { withWalletProvider } from 'src/../.storybook/decorators';
import { collateralBook37 } from 'src/stories/mocks/fixtures';
import { CollateralOrganism } from './CollateralOrganism';

export default {
    title: 'Organism/CollateralOrganism',
    component: CollateralOrganism,
    args: {
        collateralBook: collateralBook37,
    },
    parameters: {
        connected: true,
    },
    decorators: [withWalletProvider],
} as Meta<typeof CollateralOrganism>;

const Template: StoryFn<typeof CollateralOrganism> = args => (
    <CollateralOrganism {...args} />
);

export const Default = Template.bind({});
