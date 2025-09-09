import type { Meta, StoryFn } from '@storybook/react';
import { MarketTab } from '.';
import { FINANCIAL_CONSTANTS } from 'src/config/constants';

export default {
    title: 'Atoms/MarketTab',
    component: MarketTab,
    args: {
        name: '24h Volume',
        value: FINANCIAL_CONSTANTS.BPS_DIVISOR,
    },
} as Meta<typeof MarketTab>;

const Template: StoryFn<typeof MarketTab> = args => <MarketTab {...args} />;

export const Default = Template.bind({});
