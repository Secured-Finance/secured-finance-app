import type { Meta, StoryFn } from '@storybook/react';
import { Identicon } from './Identicon';

export default {
    title: 'Atoms/Identicon',
    component: Identicon,
    args: {
        value: 'test',
        size: 36,
    },
} as Meta<typeof Identicon>;

const Template: StoryFn<typeof Identicon> = args => <Identicon {...args} />;

export const Default = Template.bind({});
