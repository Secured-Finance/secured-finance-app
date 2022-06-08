import { Meta, Story } from '@storybook/react';
import { TransactionStatus } from 'src/store/transaction/types';
import SettlementValidation from './SettlementValidation';

export default {
    title: 'components/molecules/SettlementValidation',
    component: SettlementValidation,
    argTypes: {
        status: {
            control: {
                type: 'select',
                options: [
                    TransactionStatus.Created,
                    TransactionStatus.Pending,
                    TransactionStatus.Confirmed,
                    TransactionStatus.Settled,
                    TransactionStatus.Error,
                ],
            },
        },
        transactionHash: {
            control: {
                type: 'text',
            },
        },
        error: {
            control: {
                type: 'text',
            },
        },
    },
} as Meta;

type Props = {
    status: TransactionStatus;
    transactionHash?: string;
    error?: string;
};
const Template: Story<Props> = args => <SettlementValidation {...args} />;

export const Pending = Template.bind({});
Pending.args = {
    status: TransactionStatus.Pending,
    transactionHash: '0x0000000000000000000000000000000000000000',
};

export const Confirmed = Template.bind({});
Confirmed.args = {
    status: TransactionStatus.Confirmed,
    transactionHash: '0x0000000000000000000000000000000000000000',
};

export const Error = Template.bind({});
Error.args = {
    status: TransactionStatus.Error,
    transactionHash: '0x0000000000000000000000000000000000000000',
    error: 'Something went wrong',
};
