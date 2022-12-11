import { ComponentMeta, ComponentStory } from '@storybook/react';
import { useEffect, useMemo } from 'react';
import { useDispatch } from 'react-redux';
import { WithWalletProvider } from 'src/../.storybook/decorators';
import { updateLendingMarketContract } from 'src/store/availableContracts';
import { CurrencySymbol } from 'src/utils';
import { AdvancedLendingOrganism } from './AdvancedLendingOrganism';

export default {
    title: 'Organism/AdvancedLendingOrganism',
    component: AdvancedLendingOrganism,
    args: {
        maturitiesOptionList: [
            { label: 'MAR22', value: '1' },
            { label: 'JUN22', value: '2' },
            { label: 'SEP22', value: '3' },
            { label: 'DEC22', value: '1669856400' },
            { label: 'MAR23', value: '1677632400' },
        ],
    },
    decorators: [WithWalletProvider],
} as ComponentMeta<typeof AdvancedLendingOrganism>;

const Template: ComponentStory<typeof AdvancedLendingOrganism> = args => {
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
    return <AdvancedLendingOrganism {...args} />;
};

export const Default = Template.bind({});
