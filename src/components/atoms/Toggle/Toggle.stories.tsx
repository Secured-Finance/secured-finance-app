import type { Meta, StoryFn } from '@storybook/react';
import { useState } from 'react';
import { Toggle } from './Toggle';

export default {
    title: 'Atoms/Toggle',
    component: Toggle,
    args: {
        enabled: true,
    },
} as Meta<typeof Toggle>;

const Template: StoryFn<typeof Toggle> = args => {
    const [enabled, setEnabled] = useState(args.enabled);
    return <Toggle enabled={enabled} onChange={setEnabled} />;
};

export const Default = Template.bind({});
export const Disabled = Template.bind({});
Disabled.args = {
    enabled: false,
};
