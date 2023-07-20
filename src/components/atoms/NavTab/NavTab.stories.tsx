import type { Meta, StoryFn } from '@storybook/react';
import { NavTab } from './';

export default {
    title: 'Atoms/NavTab',
    component: NavTab,
    args: {
        text: 'OTC Lending',
        active: true,
    },
    parameters: {
        viewport: {
            disable: true,
        },
    },
} as Meta<typeof NavTab>;

const Template: StoryFn<typeof NavTab> = args => (
    <div className='h-20'>
        <NavTab {...args} />
    </div>
);

export const Default = Template.bind({});

export const MarketDashboard = Template.bind({});
MarketDashboard.args = {
    text: 'Market Dashboard',
    active: false,
};
