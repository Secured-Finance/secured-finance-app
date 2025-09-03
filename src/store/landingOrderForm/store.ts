import { create } from 'zustand';
import { OrderSide, WalletSource } from '@secured-finance/sf-client';
import { ViewType } from 'src/components/atoms';
import { OrderType } from 'src/types';
import { CurrencySymbol } from 'src/utils';
import { LandingOrderFormStore, defaultLandingOrderFormStore } from './types';

type LandingOrderFormState = LandingOrderFormStore;

type LandingOrderFormActions = {
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
};

type LandingOrderFormStoreWithActions = LandingOrderFormState &
    LandingOrderFormActions;

export const useLandingOrderFormStore =
    create<LandingOrderFormStoreWithActions>(set => ({
        ...defaultLandingOrderFormStore,
        setCurrency: currency => set({ currency }),
        setMaturity: maturity => set({ maturity }),
        setSide: side => set({ side }),
        setAmount: amount => set({ amount }),
        setUnitPrice: unitPrice => set({ unitPrice }),
        setOrderType: orderType => set({ orderType }),
        setLastView: lastView => set({ lastView }),
        setSourceAccount: sourceAccount => set({ sourceAccount }),
        setIsBorrowedCollateral: isBorrowedCollateral =>
            set({ isBorrowedCollateral }),
        resetUnitPrice: () => set({ unitPrice: undefined }),
        resetAmount: () => set({ amount: '' }),
    }));
