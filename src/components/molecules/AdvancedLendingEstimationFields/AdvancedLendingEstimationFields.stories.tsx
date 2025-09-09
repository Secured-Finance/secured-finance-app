import { withWalletProvider } from '.storybook/decorators';
import { OrderSide } from '@secured-finance/sf-client';
import type { Meta } from '@storybook/react';
import { StoryFn } from '@storybook/react';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { FINANCIAL_CONSTANTS } from 'src/config/constants';
import {
    setAmount,
    setCurrency,
    setMaturity,
    setOrderType,
    setSide,
} from 'src/store/landingOrderForm';
import { dec22Fixture } from 'src/stories/mocks/fixtures';
import { OrderType } from 'src/types';
import { CurrencySymbol } from 'src/utils';
import { AdvancedLendingEstimationFields } from '.';

const lastTradePrice = 8000;

export default {
    title: 'Molecules/AdvancedLendingEstimationFields',
    component: AdvancedLendingEstimationFields,
    decorators: [withWalletProvider],
    args: {
        assetPrice: 3.56,
        marketPrice: lastTradePrice,
        calculationDate: undefined,
        hasLendOpenOrders: true,
        hasBorrowOpenOrders: true,
    },
    chromatic: { delay: FINANCIAL_CONSTANTS.POINTS_K_THRESHOLD },
    parameters: {
        viewport: {
            disable: true,
        },
        connected: true,
    },
} as Meta<typeof AdvancedLendingEstimationFields>;

const LimitOrderTemplate: StoryFn<
    typeof AdvancedLendingEstimationFields
> = args => {
    const dispatch = useDispatch();
    useEffect(() => {
        const timerId = setTimeout(() => {
            dispatch(setCurrency(CurrencySymbol.WFIL));
            dispatch(setAmount('100000000000000000000'));
            dispatch(setSide(OrderSide.BORROW));
            dispatch(setOrderType(OrderType.LIMIT));
            dispatch(setMaturity(dec22Fixture.toNumber()));
        }, 200);

        return () => clearTimeout(timerId);
    }, [dispatch]);
    return <AdvancedLendingEstimationFields {...args} />;
};

export const LimitOrder = LimitOrderTemplate.bind({});

const MarketOrderTemplate: StoryFn<
    typeof AdvancedLendingEstimationFields
> = args => {
    const dispatch = useDispatch();
    useEffect(() => {
        const timerId = setTimeout(() => {
            dispatch(setCurrency(CurrencySymbol.WFIL));
            dispatch(setAmount('100000000000000000000'));
            dispatch(setSide(OrderSide.BORROW));
            dispatch(setOrderType(OrderType.MARKET));
            dispatch(setMaturity(dec22Fixture.toNumber()));
        }, 200);

        return () => clearTimeout(timerId);
    }, [dispatch]);
    return <AdvancedLendingEstimationFields {...args} />;
};

export const MarketOrder = MarketOrderTemplate.bind({});
MarketOrder.args = {
    assetPrice: 3.56,
    marketPrice: lastTradePrice,
    calculationDate: undefined,
    hasLendOpenOrders: true,
    hasBorrowOpenOrders: true,
};

const ShowDashesTemplate: StoryFn<
    typeof AdvancedLendingEstimationFields
> = args => {
    const dispatch = useDispatch();
    useEffect(() => {
        const timerId = setTimeout(() => {
            dispatch(setCurrency(CurrencySymbol.WFIL));
            dispatch(setAmount('100000000000000000000'));
            dispatch(setSide(OrderSide.BORROW));
            dispatch(setOrderType(OrderType.MARKET));
            dispatch(setMaturity(dec22Fixture.toNumber()));
        }, 200);

        return () => clearTimeout(timerId);
    }, [dispatch]);
    return <AdvancedLendingEstimationFields {...args} />;
};

export const ShowDashes = ShowDashesTemplate.bind({});
ShowDashes.args = {
    assetPrice: 3.56,
    marketPrice: lastTradePrice,
    calculationDate: undefined,
    hasLendOpenOrders: false,
    hasBorrowOpenOrders: true,
};
