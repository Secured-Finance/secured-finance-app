import { OrderSide } from '@secured-finance/sf-client';
import { useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button } from 'src/components/atoms';
import { DepositCollateral, PlaceOrder } from 'src/components/organisms';
import { CollateralBook, usePlaceOrder } from 'src/hooks';
import { getPriceMap } from 'src/store/assetPrices/selectors';
import { setWalletDialogOpen } from 'src/store/interactions';
import { selectLandingOrderForm } from 'src/store/landingOrderForm';
import { RootState } from 'src/store/types';
import { selectCollateralCurrencyBalance } from 'src/store/wallet';
import { amountFormatterFromBase } from 'src/utils';
import { computeAvailableToBorrow } from 'src/utils/collateral';
import { LoanValue } from 'src/utils/entities';
import { useWallet } from 'use-wallet';
import { generateCollateralList } from '../CollateralTab';

interface OrderActionProps {
    loanValue?: LoanValue;
    collateralBook: CollateralBook;
    orderSide?: OrderSide;
}

export const OrderAction = ({
    loanValue,
    collateralBook,
    orderSide,
}: OrderActionProps) => {
    const { account } = useWallet();
    const dispatch = useDispatch();
    const { placeOrder } = usePlaceOrder();

    const [openDepositCollateralDialog, setOpenDepositCollateralDialog] =
        useState(false);
    const [openPlaceOrderDialog, setOpenPlaceOrderDialog] = useState(false);

    const { currency, amount } = useSelector((state: RootState) =>
        selectLandingOrderForm(state.landingOrderForm)
    );

    const balances = useSelector((state: RootState) =>
        selectCollateralCurrencyBalance(state)
    );

    const assetPriceMap = useSelector((state: RootState) => getPriceMap(state));

    const depositCollateralList = useMemo(
        () => generateCollateralList(balances, false),
        [balances]
    );

    const availableToBorrow = useMemo(() => {
        return currency && assetPriceMap
            ? computeAvailableToBorrow(
                  assetPriceMap[currency],
                  collateralBook.usdCollateral,
                  collateralBook.coverage.toNumber()
              )
            : 0;
    }, [assetPriceMap, collateralBook, currency]);

    const canBorrow = useMemo(
        () => availableToBorrow > amountFormatterFromBase[currency](amount),
        [amount, availableToBorrow, currency]
    );

    return (
        <div>
            {account ? (
                canBorrow ? (
                    <Button
                        fullWidth
                        onClick={() => {
                            setOpenPlaceOrderDialog(true);
                        }}
                        data-testid='place-order-button'
                    >
                        {orderSide
                            ? orderSide === OrderSide.BORROW
                                ? 'Borrow'
                                : 'Lend'
                            : 'Place Order'}
                    </Button>
                ) : (
                    <Button
                        fullWidth
                        onClick={() => setOpenDepositCollateralDialog(true)}
                        data-testid='deposit-collateral-button'
                    >
                        Deposit collateral to borrow
                    </Button>
                )
            ) : (
                <Button
                    fullWidth
                    onClick={() => dispatch(setWalletDialogOpen(true))}
                >
                    Connect Wallet
                </Button>
            )}

            <PlaceOrder
                onPlaceOrder={placeOrder}
                isOpen={openPlaceOrderDialog}
                onClose={() => setOpenPlaceOrderDialog(false)}
                loanValue={loanValue}
            />

            <DepositCollateral
                isOpen={openDepositCollateralDialog}
                onClose={() => setOpenDepositCollateralDialog(false)}
                collateralList={depositCollateralList}
            ></DepositCollateral>
        </div>
    );
};
