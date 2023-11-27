import type { Meta, StoryFn } from '@storybook/react';
import { collateralBook37 } from 'src/stories/mocks/fixtures';
import { CurrencySymbol } from 'src/utils';
import { CollateralUsageSection } from '.';

export default {
    title: 'Molecules/CollateralUsageSection',
    component: CollateralUsageSection,
    args: {
        usdCollateral: collateralBook37.usdCollateral,
        collateralCoverage: collateralBook37.coverage,
        currency: CurrencySymbol.WFIL,
        collateralThreshold: 80,
    },
} as Meta<typeof CollateralUsageSection>;

const Template: StoryFn<typeof CollateralUsageSection> = args => (
    <CollateralUsageSection {...args} />
);

export const Default = Template.bind({});
