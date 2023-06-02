import { RESPONSIVE_PARAMETERS, VIEWPORTS } from '.storybook/constants';
import { ComponentMeta, ComponentStory } from '@storybook/react';
import { transactions } from 'src/stories/mocks/fixtures';
import { MyTransactionsTable } from './MyTransactionsTable';

export default {
    title: 'Organism/MyTransactionsTable',
    component: MyTransactionsTable,
    args: {
        data: transactions,
    },
    parameters: {
        ...RESPONSIVE_PARAMETERS,
        chromatic: {
            viewports: [VIEWPORTS.MOBILE, VIEWPORTS.TABLET, VIEWPORTS.LAPTOP],
        },
    },
} as ComponentMeta<typeof MyTransactionsTable>;

const Template: ComponentStory<typeof MyTransactionsTable> = args => (
    <MyTransactionsTable {...args} />
);

export const Default = Template.bind({});
