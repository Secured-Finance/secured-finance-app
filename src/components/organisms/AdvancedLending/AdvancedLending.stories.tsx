import { ComponentMeta, ComponentStory } from '@storybook/react';
import { useEffect, useMemo } from 'react';
import { useDispatch } from 'react-redux';
import {
    WithAssetPrice,
    WithWalletProvider,
} from 'src/../.storybook/decorators';
import { updateLendingMarketContract } from 'src/store/availableContracts';
import { CurrencySymbol } from 'src/utils';
import { AdvancedLending } from './AdvancedLending';

export default {
    title: 'Organism/AdvancedLending',
    component: AdvancedLending,
    args: {},
    decorators: [WithAssetPrice, WithWalletProvider],
} as ComponentMeta<typeof AdvancedLending>;

const Template: ComponentStory<typeof AdvancedLending> = () => {
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
    return (
        <div className='p-20'>
            <AdvancedLending />
        </div>
    );
};

export const Default = Template.bind({});

export const ConnectedToWallet = Template.bind({});
ConnectedToWallet.parameters = {
    connected: true,
};
