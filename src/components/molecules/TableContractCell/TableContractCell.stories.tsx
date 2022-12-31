import { ComponentMeta, ComponentStory } from '@storybook/react';
import { dec22Fixture } from 'src/stories/mocks/fixtures';
import { TableContractCell } from './TableContractCell';

export default {
    title: 'Molecules/TableContractCell',
    component: TableContractCell,
    args: {
        maturity: dec22Fixture,
        ccyByte32:
            '0x4554480000000000000000000000000000000000000000000000000000000000',
    },
} as ComponentMeta<typeof TableContractCell>;

const Template: ComponentStory<typeof TableContractCell> = args => (
    <TableContractCell {...args} />
);

export const Default = Template.bind({});
