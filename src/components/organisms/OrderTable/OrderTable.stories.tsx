import { RESPONSIVE_PARAMETERS, VIEWPORTS } from '.storybook/constants';
import type { Meta, StoryFn } from '@storybook/react';
import { activeOrders } from 'src/stories/mocks/fixtures';
import { OrderTable } from './OrderTable';

export default {
    title: 'Organism/OrderTable',
    component: OrderTable,
    args: {
        data: activeOrders,
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
export const Compact = Template.bind({});
Compact.args = {
    variant: 'compact',
};
Compact.parameters = {
    chromatic: {
        viewports: [VIEWPORTS.TABLET],
    },
};
