import type { Meta, StoryFn } from '@storybook/react';
import { FailurePanel } from './FailurePanel';

export default {
    title: 'Molecules/FailurePanel',
    component: FailurePanel,
    args: {
        errorMessage: 'This is an error.',
    },
} as Meta<typeof FailurePanel>;

const Template: StoryFn<typeof FailurePanel> = args => (
    <div className='w-[400px]'>
        <FailurePanel {...args} />
    </div>
);

export const Default = Template.bind({});
export const LongErrorMessage = Template.bind({});
LongErrorMessage.args = {
    errorMessage:
        'This is an example of a Long Error Message. This message should enable vertical scrollbar. This is an example of a Long Error Message. This message should enable vertical scrollbar. This is an example of a Long Error Message. This message should enable vertical scrollbar.',
};
