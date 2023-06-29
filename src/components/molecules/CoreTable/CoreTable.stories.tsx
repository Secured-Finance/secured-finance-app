import { RESPONSIVE_PARAMETERS, VIEWPORTS } from '.storybook/constants';
import { ComponentMeta, ComponentStory } from '@storybook/react';
import { createColumnHelper } from '@tanstack/react-table';
import { CoreTable } from './CoreTable';

const columnHelper = createColumnHelper<{
    name: string;
    age: number;
    english: number;
    maths: number;
    science: number;
    history: number;
}>();

const data = Array(20)
    .fill(null)
    .map((_, index) => ({
        name: `Person ${index + 1}`,
        age: Math.floor(Math.random() * 20) + 10,
        english: Math.floor(Math.random() * 100),
        maths: 60,
        science: 95,
        history: 60,
    }));

const columns = [
    columnHelper.accessor('name', {
        id: 'name',
        cell: info => <div className='min-w-[5rem]'>{info.getValue()}</div>,
    }),
    columnHelper.accessor('age', {
        id: 'age',
        cell: info => <div className='min-w-[5rem]'>{info.getValue()}</div>,
    }),
    columnHelper.accessor('english', {
        id: 'english',
        cell: info => <div className='min-w-[5rem]'>{info.getValue()}</div>,
    }),
    columnHelper.accessor('maths', {
        id: 'maths',
        cell: info => <div className='min-w-[5rem]'>{info.getValue()}</div>,
    }),
    columnHelper.accessor('science', {
        id: 'science',
        cell: info => <div className='min-w-[5rem]'>{info.getValue()}</div>,
    }),
    columnHelper.accessor('history', {
        id: 'history',
        cell: info => <div className='min-w-[5rem]'>{info.getValue()}</div>,
    }),
];
export default {
    title: 'Molecules/CoreTable',
    component: CoreTable,
    args: {
        data,
        columns,
        border: true,
    },
    parameters: {
        ...RESPONSIVE_PARAMETERS,
        chromatic: {
            viewports: [VIEWPORTS.MOBILE, VIEWPORTS.TABLET],
        },
    },
} as ComponentMeta<typeof CoreTable>;

const Template: ComponentStory<typeof CoreTable> = args => (
    <div className='text-white'>
        <CoreTable {...args} />
    </div>
);

export const Default = Template.bind({});
export const NoBorder = Template.bind({});
NoBorder.args = {
    options: {
        border: false,
    },
};

export const WithHiddenColumn = Template.bind({});
WithHiddenColumn.args = {
    options: {
        hideColumnIds: ['age'],
    },
};

export const NonResponsive = Template.bind({});
NonResponsive.args = {
    options: {
        responsive: false,
    },
};

export const WithPagination = Template.bind({});
WithPagination.args = {
    options: {
        getMoreData: () =>
            Array(20)
                .fill(null)
                .map((_, index) => ({
                    name: `Person ${index + 1}`,
                    age: Math.floor(Math.random() * 20) + 10,
                    english: Math.floor(Math.random() * 100),
                    maths: 60,
                    science: 95,
                    history: 60,
                })),
    },
};
