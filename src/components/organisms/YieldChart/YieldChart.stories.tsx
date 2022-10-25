import { ComponentMeta, ComponentStory } from '@storybook/react';
import { useEffect, useMemo } from 'react';
import { useDispatch } from 'react-redux';
import { updateLendingMarketContract } from 'src/store/availableContracts';
import { CurrencySymbol, Rate } from 'src/utils';
import { YieldChart } from './';

export default {
    title: 'Organism/YieldChart',
    component: YieldChart,
    chromatic: { diffThreshold: 1, delay: 500 },
    args: {
        asset: 'USDC',
        isBorrow: true,
        rates: [
            new Rate(100),
            new Rate(200),
            new Rate(300),
            new Rate(400),
            new Rate(500),
            new Rate(600),
        ],
        maturitiesOptionList: [
            { label: 'MAR22', value: '1' },
            { label: 'JUN22', value: '2' },
            { label: 'SEP22', value: '3' },
            { label: 'DEC22', value: '1669856400' },
            { label: 'MAR23', value: '1677632400' },
        ],
    },
    argTypes: {},
} as ComponentMeta<typeof YieldChart>;

const Template: ComponentStory<typeof YieldChart> = args => {
    const maturities = useMemo(
        () => ({
            MAR22: '1616508800',
            JUN22: '1625097600',
            SEP22: '1633046400',
            DEC22: '1640995200',
        }),
        []
    );
    const dispatch = useDispatch();
    useEffect(() => {
        const timerId = setTimeout(() => {
            dispatch(
                updateLendingMarketContract(maturities, CurrencySymbol.FIL)
            );
            dispatch(
                updateLendingMarketContract(maturities, CurrencySymbol.ETH)
            );
            dispatch(
                updateLendingMarketContract(maturities, CurrencySymbol.USDC)
            );
        }, 200);

        return () => clearTimeout(timerId);
    }, [dispatch, maturities]);
    return <YieldChart {...args} />;
};

export const Default = Template.bind({});
