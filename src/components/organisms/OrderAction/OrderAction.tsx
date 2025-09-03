import { track } from '@amplitude/analytics-browser';
import { OrderSide } from '@secured-finance/sf-client';
import { useMemo, useState } from 'react';
import { Button, ButtonSizes } from 'src/components/atoms';
import {
    DepositCollateral,
    PlaceOrder,
    generateCollateralList,
} from 'src/components/organisms';
import {
    CollateralBook,
    MarketPhase,
    useBreakpoint,
    useCurrencies,
    useLastPrices,
    useMarketPhase,
    useOrders,
} from 'src/hooks';
import { useBalances } from 'src/hooks/useBalances';
import {
    useBlockchainStore,
    useLandingOrderFormSelector,
    useUIStore,
} from 'src/store';
import { ButtonEvents } from 'src/utils';
import { Amount, LoanValue, Maturity } from 'src/utils/entities';
import { useAccount } from 'wagmi';

interface OrderActionProps {
    loanValue: LoanValue;
    collateralBook: CollateralBook;
    renderSide?: boolean;
    validation: boolean; // true to disable button
    isCurrencyDelisted: boolean;
    canPlaceOrder: boolean;
}

export const OrderAction = ({
    loanValue,
    collateralBook,
    renderSide = false,
    validation,
    isCurrencyDelisted,
    canPlaceOrder,
}: OrderActionProps) => {
    const isTablet = useBreakpoint('laptop');
    const { isConnected } = useAccount();
    const { setWalletDialogOpen } = useUIStore();
    const { chainError } = useBlockchainStore();
    const { placeOrder, placePreOrder } = useOrders();

    const [openDepositCollateralDialog, setOpenDepositCollateralDialog] =
        useState(false);
    const [openPlaceOrderDialog, setOpenPlaceOrderDialog] = useState(false);

    const { currency, amount, side, maturity, orderType, sourceAccount } =
        useLandingOrderFormSelector();

    const marketPhase = useMarketPhase(currency, maturity);

    const balances = useBalances();

    const { data: priceList } = useLastPrices();
    const { data: currencies = [] } = useCurrencies(true);
    const price = priceList[currency];

    const depositCollateralList = useMemo(
        () =>
            generateCollateralList(
                balances,
                true,
                side === OrderSide.BORROW ? currencies : [currency]
            ),
        [balances, currencies, currency, side]
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
        (marketPhase !== MarketPhase.PRE_ORDER &&
            marketPhase !== MarketPhase.OPEN);

    const buttonSize = isTablet ? ButtonSizes.md : ButtonSizes.lg;

    return (
        <>
            {isConnected &&
                (canPlaceOrder ? (
                    <Button
                        disabled={isPlaceOrderDisabled || chainError}
                        fullWidth
                        onClick={() => {
                            setOpenPlaceOrderDialog(true);
                            track(ButtonEvents.PLACE_ORDER_BUTTON);
                        }}
                        data-testid='place-order-button'
                        aria-label={getButtonText()}
                        size={buttonSize}
                    >
                        {getButtonText()}
                    </Button>
                ) : (
                    <Button
                        disabled={chainError}
                        fullWidth
                        onClick={() => {
                            setOpenDepositCollateralDialog(true);
                            track(ButtonEvents.DEPOSIT_COLLATERAL_BUTTON);
                        }}
                        data-testid='deposit-collateral-button'
                        size={buttonSize}
                    >
                        Deposit
                    </Button>
                ))}
            {!isConnected && (
                <Button
                    fullWidth
                    onClick={() => setWalletDialogOpen(true)}
                    size={buttonSize}
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
                isCurrencyDelisted={isCurrencyDelisted}
            />

            <DepositCollateral
                isOpen={openDepositCollateralDialog}
                onClose={() => setOpenDepositCollateralDialog(false)}
                collateralList={depositCollateralList}
                source='Order Action Button'
            ></DepositCollateral>
        </>
    );
};
