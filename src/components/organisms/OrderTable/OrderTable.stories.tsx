import { RESPONSIVE_PARAMETERS, VIEWPORTS } from '.storybook/constants';
import type { Meta, StoryFn } from '@storybook/react';
import { activeOrders, preOpenOrders } from 'src/stories/mocks/fixtures';
import { OrderTable } from './OrderTable';

export default {
    title: 'Organism/OrderTable',
    component: OrderTable,
    args: {
        data: [
            ...activeOrders,
            ...activeOrders,
            ...activeOrders,
            ...preOpenOrders,
        ],
    },
    parameters: {
        ...RESPONSIVE_PARAMETERS,
        chromatic: {
            viewports: [VIEWPORTS.MOBILE, VIEWPORTS.TABLET],
        },
    },
} as Meta<typeof OrderTable>;

const Template: StoryFn<typeof OrderTable> = args => <OrderTable {...args} />;

export const Default = Template.bind({});
