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
            ccyIndex: 0,
            ccyName: 'ETH',
            collateral: new BigNumber('10000000000000000000'),
            usdCollateral: new BigNumber('100000000000000000000'),
            locked: new BigNumber('5000000000000000000'),
            usdLocked: new BigNumber('50000000000000000000'),
        },
        marketRate: 100,
    },
    parameters: {
        chromatic: { disableSnapshot: false },
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
