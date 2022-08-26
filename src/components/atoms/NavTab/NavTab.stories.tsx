import { ComponentMeta, ComponentStory } from '@storybook/react';
import { NavTab } from './';

export default {
    title: 'Atoms/NavTab',
    component: NavTab,
    args: {
        text: 'OTC Lending',
        active: true,
        onClick: () => {},
    },
    parameters: {
        chromatic: { disableSnapshot: false },
    },
} as ComponentMeta<typeof NavTab>;

const Template: ComponentStory<typeof NavTab> = args => (
    <div className='h-20'>
        <NavTab {...args} />
    </div>
);

export const Default = Template.bind({});

export const MarketDashboard = Template.bind({});
MarketDashboard.args = {
    text: 'Market Dashboard',
    active: false,
    onClick: () => {},
    as: 'div',
};
