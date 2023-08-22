import type { Meta, StoryFn } from '@storybook/react';
import { BorrowedCollateral } from './BorrowedCollateral';

export default {
    title: 'Molecules/BorrowedCollateral',
    args: {
        label: (
            <div className='typography-caption text-slateGray'>
                Bond as Collateral
            </div>
        ),
    },
    component: BorrowedCollateral,
} as Meta<typeof BorrowedCollateral>;

const Template: StoryFn<typeof BorrowedCollateral> = args => (
    <BorrowedCollateral {...args} />
);

export const Default = Template.bind({});
