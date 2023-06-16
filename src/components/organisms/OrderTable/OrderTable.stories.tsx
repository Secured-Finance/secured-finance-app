import { RESPONSIVE_PARAMETERS, VIEWPORTS } from '.storybook/constants';
import { ComponentMeta, ComponentStory } from '@storybook/react';
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
} as ComponentMeta<typeof OrderTable>;

const Template: ComponentStory<typeof OrderTable> = args => (
    <OrderTable {...args} />
);

export const Default = Template.bind({});
