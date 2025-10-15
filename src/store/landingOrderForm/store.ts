import { OrderSide, WalletSource } from '@secured-finance/sf-client';
import { ViewType } from 'src/components/atoms';
import { OrderType } from 'src/types';
import { CurrencySymbol } from 'src/utils';
import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';
import {
    DEFAULT_LANDING_ORDER_FORM_STATE,
    LandingOrderFormState,
} from './types';

interface LandingOrderFormActions {
    setCurrency: (currency: CurrencySymbol) => void;
    setMaturity: (maturity: number) => void;
    setSide: (side: OrderSide) => void;
    setAmount: (amount: string) => void;
    setUnitPrice: (unitPrice: string | undefined) => void;
    setOrderType: (orderType: OrderType) => void;
    setLastView: (lastView: ViewType) => void;
    setSourceAccount: (sourceAccount: WalletSource) => void;
    setIsBorrowedCollateral: (isBorrowedCollateral: boolean) => void;
    resetUnitPrice: () => void;
    resetAmount: () => void;
    resetForm: () => void;
    resetStore: () => void;
}

type LandingOrderFormStoreWithActions = LandingOrderFormState &
    LandingOrderFormActions;

export const useLandingOrderFormStore =
    create<LandingOrderFormStoreWithActions>()(
        subscribeWithSelector((set, _get) => ({
            ...DEFAULT_LANDING_ORDER_FORM_STATE,
            setCurrency: (currency: CurrencySymbol) => set({ currency }),
            setMaturity: (maturity: number) => set({ maturity }),
            setSide: (side: OrderSide) => set({ side }),
            setAmount: (amount: string) => set({ amount }),
            setUnitPrice: (unitPrice: string | undefined) => set({ unitPrice }),
            setOrderType: (orderType: OrderType) => set({ orderType }),
            setLastView: (lastView: ViewType) => set({ lastView }),
            setSourceAccount: (sourceAccount: WalletSource) =>
                set({ sourceAccount }),
            setIsBorrowedCollateral: (isBorrowedCollateral: boolean) =>
                set({ isBorrowedCollateral }),

            resetUnitPrice: () => set({ unitPrice: undefined }),
            resetAmount: () => set({ amount: '' }),
            resetForm: () =>
                set({
                    amount: '',
                    unitPrice: undefined,
                }),
            resetStore: () => set(DEFAULT_LANDING_ORDER_FORM_STATE),
        }))
    );
