import { BookOpenIcon, PencilIcon } from '@heroicons/react/24/outline';
import type { Meta, StoryFn } from '@storybook/react';
import { Selector } from './Selector';

const assetList = [
    {
        label: 'Label 1',
        value: 'value1',
        note: 'note 1',
    },
    {
        label: 'Label 2',
        value: 'value2',
        note: 'note 2',
    },
];

export default {
    title: 'Atoms/Selector',
    component: Selector,
    args: {
        headerText: 'Select Asset',
        optionList: assetList,
        onChange: () => {},
    },
} as Meta<typeof Selector>;

const Template: StoryFn<typeof Selector> = args => (
    <div className='h-20 w-[360px]'>
        <Selector {...args} />
    </div>
);

export const Default = Template.bind({});

export const WithIcon = Template.bind({});
WithIcon.args = {
    optionList: [
        {
            label: 'Pencil',
            value: 'pencil',
            note: '10',
            icon: <PencilIcon className='h-4 w-4' />,
        },
        {
            label: 'Book',
            value: 'book',
            note: '3',
            icon: <BookOpenIcon className='h-4 w-4' />,
        },
    ],
};
