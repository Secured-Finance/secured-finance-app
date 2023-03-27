import { ComponentMeta, ComponentStory } from '@storybook/react';
import { FailurePanel } from './FailurePanel';

export default {
    title: 'Molecules/FailurePanel',
    component: FailurePanel,
    args: {
        itemList: [
            ['From', '0.000000000000000000'],
            ['To', '0.000000000000000000'],
            ['Price', '0.000000000000000000'],
        ],
    },
} as ComponentMeta<typeof FailurePanel>;

const Template: ComponentStory<typeof FailurePanel> = args => (
    <FailurePanel {...args} />
);

export const Default = Template.bind({});
