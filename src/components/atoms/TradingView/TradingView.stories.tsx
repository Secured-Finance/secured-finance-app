import type { Meta, StoryFn } from '@storybook/react';
import { TradingView } from './';

export default {
    title: 'Atoms/TradingView',
    component: TradingView,
    args: {
        className: 'font-bold',
        test: 'andy',
    },
} as Meta<typeof TradingView>;

const Template: StoryFn<typeof TradingView> = args => <TradingView {...args} />;

export const Default = Template.bind({});
