import type { Meta, StoryFn } from '@storybook/react';
import { dec22Fixture, ethBytes32 } from 'src/stories/mocks/fixtures';
import { TableContractCell } from './TableContractCell';

export default {
    title: 'Molecules/TableContractCell',
    component: TableContractCell,
    args: {
        maturity: dec22Fixture,
        ccyByte32: ethBytes32,
    },
} as Meta<typeof TableContractCell>;

const Template: StoryFn<typeof TableContractCell> = args => (
    <TableContractCell {...args} />
);

export const Default = Template.bind({});
export const Compact = Template.bind({});
Compact.args = {
    variant: 'compact',
};

export const CurrencyOnly = Template.bind({});
CurrencyOnly.args = {
    variant: 'currencyOnly',
};

export const ContractOnly = Template.bind({});
ContractOnly.args = {
    variant: 'contractOnly',
};
