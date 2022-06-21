import { ComponentMeta, ComponentStory } from '@storybook/react';
import React from 'react';
import { WalletRadioGroup } from './WalletRadioGroup';

export default {
    title: 'Molecules/WalletRadioGroup',
    component: WalletRadioGroup,
    parameters: {
        chromatic: { disableSnapshot: false },
    },
} as ComponentMeta<typeof WalletRadioGroup>;

const Template: ComponentStory<typeof WalletRadioGroup> = args => {
    const [value, setValue] = React.useState('');
    return <WalletRadioGroup value={value} onChange={setValue} />;
};

export const Default = Template.bind({});
