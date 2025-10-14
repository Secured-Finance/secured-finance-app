import { withWalletProvider } from '.storybook/decorators';
import { OrderSide } from '@secured-finance/sf-client';
import type { Meta, StoryFn } from '@storybook/react';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setAmount, setCurrency } from 'src/store/landingOrderForm';
import { collateralBook37, mar23Fixture } from 'src/stories/mocks/fixtures';
import { CurrencySymbol } from 'src/utils';
import { Amount } from 'src/utils/entities';
import { CollateralSimulationSection } from './CollateralSimulationSection';
import { FINANCIAL_CONSTANTS } from 'src/config/constants';

export default {
    title: 'Organism/CollateralSimulationSection',
    component: CollateralSimulationSection,
    decorators: [withWalletProvider],
    args: {
        collateral: collateralBook37,
        tradeAmount: new Amount('50000000000000000000', CurrencySymbol.WFIL),
        assetPrice: 6.0,
        side: OrderSide.BORROW,
        maturity: mar23Fixture,
    },
    chromatic: { delay: FINANCIAL_CONSTANTS.POINTS_K_THRESHOLD },
    parameters: {
        connected: true,
    },
} as Meta<typeof CollateralSimulationSection>;

const Template: StoryFn<typeof CollateralSimulationSection> = args => {
    const dispatch = useDispatch();
    useEffect(() => {
        const timerId = setTimeout(() => {
            dispatch(setCurrency(CurrencySymbol.WFIL));
            dispatch(setAmount('50000000000000000000'));
        }, 200);

        return () => clearTimeout(timerId);
    }, [dispatch]);

    return <CollateralSimulationSection {...args} />;
};

export const Trade = Template.bind({});
