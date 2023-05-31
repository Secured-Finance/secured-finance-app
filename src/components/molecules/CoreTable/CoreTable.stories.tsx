import { RESPONSIVE_PARAMETERS, VIEWPORTS } from '.storybook/constants';
import { ComponentMeta, ComponentStory } from '@storybook/react';
import { createColumnHelper } from '@tanstack/react-table';
import { CoreTable } from './CoreTable';

const columnHelper = createColumnHelper<{ name: string; age: number }>();

const data = [
    { name: 'John', age: 20 },
    { name: 'Jane', age: 21 },
];
const columns = [
    columnHelper.accessor('name', {
        id: 'name',
        cell: info => info.getValue(),
    }),
    columnHelper.accessor('age', {
        id: 'age',
        cell: info => info.getValue(),
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
    <CoreTable {...args} />
);

export const Default = Template.bind({});
export const NoBorder = Template.bind({});
NoBorder.args = {
    border: false,
};

export const WithHiddenColumn = Template.bind({});
WithHiddenColumn.args = {
    hideColumnIds: ['age'],
};
