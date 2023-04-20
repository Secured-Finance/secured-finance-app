import { OrderSide, WalletSource } from '@secured-finance/sf-client';
import { BigNumber } from 'ethers';
import { useCallback } from 'react';
import { CurrencySymbol, toCurrency } from 'src/utils';
import { Maturity } from 'src/utils/entities';
import useSF from '../useSecuredFinance';

export enum OrderType {
    MARKET = 'Market',
    LIMIT = 'Limit',
}

export const useOrders = () => {
    const securedFinance = useSF();

    const cancelOrder = useCallback(
        async (
            orderId: number | BigNumber,
            ccy: CurrencySymbol,
            maturity: Maturity
        ) => {
            try {
                if (!securedFinance) return;
                const tx = await securedFinance.cancelLendingOrder(
                    toCurrency(ccy),
                    maturity.toNumber(),
                    orderId
                );
                return tx;
            } catch (error) {
                console.error(error);
            }
        },
        [securedFinance]
    );

    const placeOrder = useCallback(
        async (
            ccy: CurrencySymbol,
            maturity: Maturity,
            side: OrderSide,
            amount: BigNumber,
            unitPrice: number,
            sourceWallet: WalletSource
        ) => {
            try {
                if (!securedFinance) return;

                const tx = await securedFinance.placeOrder(
                    toCurrency(ccy),
                    maturity.toNumber(),
                    side,
                    amount,
                    sourceWallet,
                    unitPrice
                );

                return tx;
            } catch (error) {
                console.error(error);
            }
        },
        [securedFinance]
    );

    const unwindOrder = useCallback(
        async (ccy: CurrencySymbol, maturity: Maturity) => {
            try {
                if (!securedFinance) return;

                const tx = await securedFinance.unwindOrder(
                    toCurrency(ccy),
                    maturity.toNumber()
                );

                return tx;
            } catch (error) {
                console.error(error);
            }
        },
        [securedFinance]
    );

    const placePreOrder = useCallback(
        async (
            ccy: CurrencySymbol,
            maturity: Maturity,
            side: OrderSide,
            amount: BigNumber,
            unitPrice: number,
            sourceWallet: WalletSource
        ) => {
            try {
                if (!securedFinance) return;

                const tx = await securedFinance.placePreOrder(
                    toCurrency(ccy),
                    maturity.toNumber(),
                    side,
                    amount,
                    sourceWallet,
                    unitPrice
                );

                return tx;
            } catch (error) {
                console.error(error);
            }
        },
        [securedFinance]
    );

    return { cancelOrder, placeOrder, unwindOrder, placePreOrder };
};
