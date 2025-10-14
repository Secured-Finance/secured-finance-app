import type { Meta, StoryFn } from '@storybook/react';
import { OrderDisplayBox } from '.';
import { FINANCIAL_CONSTANTS } from 'src/config/constants';

export default {
    title: 'Atoms/OrderDisplayBox',
    component: OrderDisplayBox,
    args: {
        field: 'Fixed Rate',
        value: FINANCIAL_CONSTANTS.POINTS_K_THRESHOLD,
    },
} as Meta<typeof OrderDisplayBox>;

const Template: StoryFn<typeof OrderDisplayBox> = args => (
    <OrderDisplayBox {...args} />
);

export const Default = Template.bind({});

export const WithInformationText = Template.bind({});
WithInformationText.args = {
    informationText: 'Some hint.',
};
