import { ComponentMeta, ComponentStory } from '@storybook/react';
import { FailurePanel } from './FailurePanel';

export default {
    title: 'Molecules/FailurePanel',
    component: FailurePanel,
    args: {
        errorMessage: 'This is an error.',
    },
} as ComponentMeta<typeof FailurePanel>;

const Template: ComponentStory<typeof FailurePanel> = args => (
    <div className='flex w-[400px]'>
        <FailurePanel {...args} />
    </div>
);

export const Default = Template.bind({});
export const LongErrorMessage = Template.bind({});
LongErrorMessage.args = {
    errorMessage:
        'This is an example of a Long Error Message. This message should enable horizontal scrollbar.',
};
