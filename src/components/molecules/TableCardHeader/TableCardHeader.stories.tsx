import { OrderSide } from '@secured-finance/sf-client';
import type { Meta, StoryFn } from '@storybook/react';
import { mar23Fixture } from 'src/stories/mocks/fixtures';
import { CurrencySymbol } from 'src/utils';
import { TableCardHeader } from '.';

export default {
    title: 'Molecules/TableCardHeader',
    component: TableCardHeader,
    args: {
        currency: CurrencySymbol.WFIL,
        maturity: mar23Fixture,
        side: OrderSide.BORROW,
        price: 9522,
    },
} as Meta<typeof TableCardHeader>;

const Template: StoryFn<typeof TableCardHeader> = args => (
    <TableCardHeader {...args} />
);

export const Default = Template.bind({});
