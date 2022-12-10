import { ComponentMeta, ComponentStory } from '@storybook/react';
import { useEffect, useMemo } from 'react';
import { useDispatch } from 'react-redux';
import { updateLendingMarketContract } from 'src/store/availableContracts';
import { maturityOptions } from 'src/stories/mocks/fixtures';
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
            new Rate(100000000),
            new Rate(200000),
            new Rate(300000),
            new Rate(400000),
            new Rate(500000),
            new Rate(600000),
            new Rate(700000),
            new Rate(800000),
        ],
        maturitiesOptionList: maturityOptions,
    },
    argTypes: {},
} as ComponentMeta<typeof YieldChart>;

const Template: ComponentStory<typeof YieldChart> = args => {
    const maturities = useMemo(
        () => ({
            MAR22: 1616508800,
            JUN22: 1625097600,
            SEP22: 1633046400,
            DEC22: 1640995200,
        }),
        []
    );
    const dispatch = useDispatch();
    useEffect(() => {
        const timerId = setTimeout(() => {
            dispatch(
                updateLendingMarketContract(maturities, CurrencySymbol.USDC)
            );
        }, 200);

        return () => clearTimeout(timerId);
    }, [dispatch, maturities]);
    return <YieldChart {...args} />;
};

export const Default = Template.bind({});
