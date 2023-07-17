import type { Meta, StoryFn } from '@storybook/react';
import { CollateralManagementConciseTab } from '.';

export default {
    title: 'Atoms/CollateralManagementConciseTab',
    component: CollateralManagementConciseTab,
    args: {
        collateralCoverage: 37,
        totalCollateralInUSD: 100,
        collateralThreshold: 80,
    },
} as Meta<typeof CollateralManagementConciseTab>;

const Template: StoryFn<typeof CollateralManagementConciseTab> = args => (
    <CollateralManagementConciseTab {...args} />
);

export const Default = Template.bind({});
