import { ComponentMeta, ComponentStory } from '@storybook/react';
import { FailurePanel } from './FailurePanel';

export default {
    title: 'Molecules/FailurePanel',
    component: FailurePanel,
    args: {
        errorMessage: 'This is an error',
    },
} as ComponentMeta<typeof FailurePanel>;

const Template: ComponentStory<typeof FailurePanel> = args => (
    <FailurePanel {...args} />
);

export const Default = Template.bind({});
