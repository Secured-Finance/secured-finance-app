import { ComponentMeta, ComponentStory } from '@storybook/react';
import { Chip } from './Chip';

export default {
    title: 'Atoms/Chip',
    component: Chip,
    args: {
        label: 'Borrow',
    },
} as ComponentMeta<typeof Chip>;

const Template: ComponentStory<typeof Chip> = args => <Chip {...args} />;

export const Default = Template.bind({});
