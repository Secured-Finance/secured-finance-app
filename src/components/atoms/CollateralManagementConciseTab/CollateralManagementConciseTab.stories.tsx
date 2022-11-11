import { ComponentMeta, ComponentStory } from '@storybook/react';
import { CollateralManagementConciseTab } from '.';

export default {
    title: 'Atoms/CollateralManagementConciseTab',
    component: CollateralManagementConciseTab,
    args: {
        collateralCoverage: 70,
        totalCollateralInUSD: 100,
        liquidationPercentage: 23,
    },
} as ComponentMeta<typeof CollateralManagementConciseTab>;

const Template: ComponentStory<
    typeof CollateralManagementConciseTab
> = args => <CollateralManagementConciseTab {...args} />;

export const Default = Template.bind({});
