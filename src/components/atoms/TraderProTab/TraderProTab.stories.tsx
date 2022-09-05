import { ComponentMeta, ComponentStory } from '@storybook/react';
import { TraderProTab } from './';

export default {
    title: 'Atoms/TraderProTab',
    component: TraderProTab,
    args: {
        text: 'Trader Pro',
        onClick: () => {},
    },
} as ComponentMeta<typeof TraderProTab>;

const Template: ComponentStory<typeof TraderProTab> = args => (
    <TraderProTab {...args} />
);

export const Default = Template.bind({});
