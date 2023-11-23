import { Meta, StoryFn } from '@storybook/react';
import { InfoToolTip } from './InfoToolTip';

export default {
    title: 'Molecules/InfoToolTip',
    component: InfoToolTip,
    args: {
        message: 'This is a tooltip',
    },
} as Meta<typeof InfoToolTip>;

const Template: StoryFn<typeof InfoToolTip> = args => (
    <div className='mx-10 flex w-full justify-center'>
        <InfoToolTip {...args} />
    </div>
);

export const Default = Template.bind({});
export const AllIconSizesAndColors: StoryFn<typeof InfoToolTip> = () => (
    <div className='mx-10 grid w-full grid-cols-2 justify-center'>
        <div className='flex flex-col gap-4'>
            <InfoToolTip iconSize='small'>Small</InfoToolTip>
            <InfoToolTip iconSize='medium'>Medium</InfoToolTip>
            <InfoToolTip iconSize='large'>Large</InfoToolTip>
        </div>
        <div className='flex flex-col gap-4'>
            <InfoToolTip iconColor='gray'>Gray</InfoToolTip>
            <InfoToolTip iconColor='white'>White</InfoToolTip>
            <InfoToolTip iconColor='yellow'>Yellow</InfoToolTip>
        </div>
    </div>
);
