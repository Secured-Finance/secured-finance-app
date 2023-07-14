import { OrderSide } from '@secured-finance/sf-client';
import { useMemo, useState } from 'react';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { Button } from 'src/components/atoms';
import {
    DepositCollateral,
    PlaceOrder,
    generateCollateralList,
} from 'src/components/organisms';
import { CollateralBook, useOrders } from 'src/hooks';
import { getPriceMap } from 'src/store/assetPrices/selectors';
import { MarketPhase, selectMarketPhase } from 'src/store/availableContracts';
import { setWalletDialogOpen } from 'src/store/interactions';
import { selectLandingOrderForm } from 'src/store/landingOrderForm';
import { RootState } from 'src/store/types';
import { selectCollateralCurrencyBalance } from 'src/store/wallet';
import { amountFormatterFromBase } from 'src/utils';
import { MAX_COVERAGE, computeAvailableToBorrow } from 'src/utils/collateral';
import { Amount, LoanValue, Maturity } from 'src/utils/entities';
import { useAccount } from 'wagmi';

interface OrderActionProps {
    loanValue: LoanValue;
    collateralBook: CollateralBook;
    renderSide?: boolean;
    validation: boolean;
}

export const OrderAction = ({
    loanValue,
    collateralBook,
    renderSide = false,
    validation,
}: OrderActionProps) => {
    const { isConnected, isDisconnected } = useAccount();
    const dispatch = useDispatch();
    const { placeOrder, placePreOrder } = useOrders();

    const [openDepositCollateralDialog, setOpenDepositCollateralDialog] =
        useState(false);
    const [openPlaceOrderDialog, setOpenPlaceOrderDialog] = useState(false);

    const { currency, amount, side, maturity, orderType, sourceAccount } =
        useSelector((state: RootState) =>
            selectLandingOrderForm(state.landingOrderForm)
        );

    const marketPhase = useSelector((state: RootState) =>
        selectMarketPhase(currency, maturity)(state)
    );

    const balances = useSelector(
        (state: RootState) => selectCollateralCurrencyBalance(state),
        shallowEqual
    );

    const assetPriceMap = useSelector((state: RootState) => getPriceMap(state));
    const price = assetPriceMap[currency];

    const depositCollateralList = useMemo(
        () => generateCollateralList(balances, false),
        [balances]
    );

    const availableToBorrow = useMemo(() => {
        return currency && price
            ? computeAvailableToBorrow(
                  price,
                  collateralBook.usdCollateral,
                  collateralBook.coverage.toNumber() / MAX_COVERAGE,
                  collateralBook.collateralThreshold
              )
            : 0;
    }, [
        price,
        collateralBook.coverage,
        collateralBook.usdCollateral,
        collateralBook.collateralThreshold,
        currency,
    ]);

    const canBorrow = useMemo(
        () => availableToBorrow > amountFormatterFromBase[currency](amount),
        [amount, availableToBorrow, currency]
    );

    const getButtonText = () => {
        if (!renderSide) {
            return 'Place Order';
        }

        if (side === OrderSide.BORROW) {
            return 'Borrow';
        } else {
            return 'Lend';
        }
    };

    const isPlaceOrderDisabled =
        validation ||
        !amount ||
        amount.isZero() ||
        (marketPhase !== MarketPhase.PRE_ORDER &&
            marketPhase !== MarketPhase.OPEN);

    return (
        <div>
            {isConnected &&
                (canBorrow || side === OrderSide.LEND ? (
                    <Button
                        disabled={isPlaceOrderDisabled}
                        fullWidth
                        onClick={() => {
                            setOpenPlaceOrderDialog(true);
                        }}
                        data-testid='place-order-button'
                    >
                        {getButtonText()}
                    </Button>
                ) : (
                    <Button
                        fullWidth
                        onClick={() => setOpenDepositCollateralDialog(true)}
                        data-testid='deposit-collateral-button'
                    >
                        Deposit collateral to borrow
                    </Button>
                ))}
            {isDisconnected && (
                <Button
                    fullWidth
                    onClick={() => dispatch(setWalletDialogOpen(true))}
                >
                    Connect Wallet
                </Button>
            )}

            <PlaceOrder
                onPlaceOrder={
                    marketPhase === MarketPhase.OPEN
                        ? placeOrder
                        : placePreOrder
                }
                isOpen={openPlaceOrderDialog}
                onClose={() => setOpenPlaceOrderDialog(false)}
                loanValue={loanValue}
                collateral={collateralBook}
                assetPrice={price}
                maturity={new Maturity(maturity)}
                orderAmount={new Amount(amount, currency)}
                side={side}
                orderType={orderType}
                walletSource={sourceAccount}
            />

            <DepositCollateral
                isOpen={openDepositCollateralDialog}
                onClose={() => setOpenDepositCollateralDialog(false)}
                collateralList={depositCollateralList}
                source='Order Action Button'
            ></DepositCollateral>
        </div>
    );
};
