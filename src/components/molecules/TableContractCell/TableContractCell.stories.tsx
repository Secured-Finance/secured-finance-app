import { ComponentMeta, ComponentStory } from '@storybook/react';
import { dec22Fixture, ethBytes32 } from 'src/stories/mocks/fixtures';
import { TableContractCell } from './TableContractCell';

export default {
    title: 'Molecules/TableContractCell',
    component: TableContractCell,
    args: {
        maturity: dec22Fixture,
        ccyByte32: ethBytes32,
    },
} as ComponentMeta<typeof TableContractCell>;

const Template: ComponentStory<typeof TableContractCell> = args => (
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
