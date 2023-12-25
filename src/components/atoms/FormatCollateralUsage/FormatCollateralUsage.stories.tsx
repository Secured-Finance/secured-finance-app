import type { Meta, StoryFn } from '@storybook/react';
import { FormatCollateralUsage } from './FormatCollateralUsage';

export default {
    title: 'Atoms/FormatCollateralUsage',
    component: FormatCollateralUsage,
    args: {
        initialValue: 5000,
        finalValue: 6700,
        maxValue: Number.MAX_VALUE,
    },
} as Meta<typeof FormatCollateralUsage>;

const Template: StoryFn<typeof FormatCollateralUsage> = args => (
    <FormatCollateralUsage {...args} />
);

export const Default = Template.bind({});

export const WithMaxValue = Template.bind({});
WithMaxValue.args = {
    maxValue: 5500,
};
