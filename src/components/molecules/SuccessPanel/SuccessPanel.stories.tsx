import { ComponentMeta, ComponentStory } from '@storybook/react';
import { SuccessPanel } from './SuccessPanel';

export default {
    title: 'Molecules/SuccessPanel',
    component: SuccessPanel,
    args: {
        itemList: [
            ['From', '0.000000000000000000'],
            ['To', '0.000000000000000000'],
            ['Price', '0.000000000000000000'],
        ],
    },
} as ComponentMeta<typeof SuccessPanel>;

const Template: ComponentStory<typeof SuccessPanel> = args => (
    <SuccessPanel {...args} />
);

export const Default = Template.bind({});
