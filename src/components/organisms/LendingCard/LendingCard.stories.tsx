import { ComponentMeta, ComponentStory } from '@storybook/react';
import { BigNumber } from 'bignumber.js';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { WithAssetPrice } from 'src/../.storybook/decorators';
import { updateLatestBlock } from 'src/store/blockchain';
import { LendingCard } from './LendingCard';

export default {
    title: 'Organism/LendingCard',
    component: LendingCard,
    args: {
        onPlaceOrder: async () => {
            return Promise.resolve();
        },
        collateralBook: {
            ccyName: 'ETH',
            collateral: new BigNumber('10000000000000000000'),
            usdCollateral: new BigNumber('100000000000000000000'),
            coverage: new BigNumber('80'),
        },
        marketRate: 100,
        maturitiesOptionList: [
            { label: 'MAR22', value: '1' },
            { label: 'JUN22', value: '2' },
            { label: 'SEP22', value: '3' },
            { label: 'DEC22', value: '1669856400' },
            { label: 'MAR23', value: '1677632400' },
        ],
    },
    decorators: [WithAssetPrice],
} as ComponentMeta<typeof LendingCard>;

const Template: ComponentStory<typeof LendingCard> = args => {
    const dispatch = useDispatch();

    useEffect(() => {
        // Quick and dirty way to wait for the Mock to be mounted.
        // There must be another way but we barely use Axios in our code.
        setTimeout(() => dispatch(updateLatestBlock(12345)), 100);
    }, [dispatch]);

    return <LendingCard {...args} />;
};

export const Default = Template.bind({});

export const WithError = Template.bind({});
WithError.args = {
    onPlaceOrder: async () => {
        throw Error('Something went wrong');
    },
};
export const PendingTransaction = Template.bind({});
PendingTransaction.args = {
    onPlaceOrder: async () => {
        return new Promise(resolve => {
            setTimeout(resolve, 5000);
        });
    },
};
