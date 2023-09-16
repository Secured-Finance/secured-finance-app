import { RESPONSIVE_PARAMETERS, VIEWPORTS } from '.storybook/constants';
import type { Meta, StoryFn } from '@storybook/react';
import { createColumnHelper } from '@tanstack/react-table';
import { useState } from 'react';
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
        age: 10,
        english: 80,
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
} as Meta<typeof CoreTable>;

const Template: StoryFn<typeof CoreTable> = args => (
    <div className='text-white'>
        <CoreTable {...args} />
    </div>
);

const PaginationTemplate: StoryFn<typeof CoreTable> = args => {
    const [data, setData] = useState(args.data);

    return (
        <div className='text-white'>
            <CoreTable
                {...args}
                data={data}
                options={{
                    pagination: {
                        totalData: 100,
                        getMoreData: () => {
                            const newData = Array(20)
                                .fill(null)
                                .map((_, index) => ({
                                    name: `Person ${data.length + index + 1}`,
                                    age: 15,
                                    english: 90,
                                    maths: 60,
                                    science: 95,
                                    history: 60,
                                }));

                            const updatedData = [...data, ...newData];
                            setData(updatedData);
                        },
                        containerHeight: false,
                    },
                }}
            />
        </div>
    );
};

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

export const WithPagination = PaginationTemplate.bind({});
export const HideHeader = Template.bind({});
HideHeader.args = {
    options: {
        showHeaders: false,
    },
};
