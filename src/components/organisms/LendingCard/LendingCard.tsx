import { BigNumber, ContractTransaction } from 'ethers';
import { useCallback, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { BorrowLendSelector, Button } from 'src/components/atoms';
import { CollateralUsageSection } from 'src/components/atoms/CollateralUsageSection';
import { AssetSelector, TermSelector } from 'src/components/molecules';
import { CollateralBook, OrderSide } from 'src/hooks';
import { getPriceMap } from 'src/store/assetPrices/selectors';
import {
    selectLandingOrderForm,
    setAmount,
    setCurrency,
    setMaturity,
    setSide,
} from 'src/store/landingOrderForm';
import { setLastMessage } from 'src/store/lastError';
import { RootState } from 'src/store/types';
import { MaturityOptionList } from 'src/types';
import {
    CurrencySymbol,
    formatDate,
    getCurrencyMapAsList,
    getCurrencyMapAsOptions,
    handleContractTransaction,
    percentFormat,
    Rate,
} from 'src/utils';
import { computeAvailableToBorrow } from 'src/utils/collateral';
import { Maturity } from 'src/utils/entities';

export const LendingCard = ({
    onPlaceOrder,
    collateralBook,
    marketRate,
    maturitiesOptionList,
}: {
    onPlaceOrder: (
        ccy: CurrencySymbol,
        maturity: number | BigNumber,
        side: OrderSide,
        amount: BigNumber,
        rate: number
    ) => Promise<ContractTransaction | undefined>;
    collateralBook: CollateralBook;
    marketRate: Rate;
    maturitiesOptionList: MaturityOptionList;
}) => {
    const [pendingTransaction, setPendingTransaction] = useState(false);
    const { currency, maturity, amount, side } = useSelector(
        (state: RootState) => selectLandingOrderForm(state.landingOrderForm)
    );

    const dispatch = useDispatch();

    const shortNames = useMemo(
        () =>
            getCurrencyMapAsList().reduce<Record<string, CurrencySymbol>>(
                (acc, ccy) => ({
                    ...acc,
                    [ccy.name]: ccy.symbol,
                }),
                {}
            ),
        []
    );

    const amountFormatterMap = useMemo(
        () =>
            getCurrencyMapAsList().reduce<
                Record<CurrencySymbol, (value: number) => BigNumber>
            >(
                (acc, ccy) => ({
                    ...acc,
                    [ccy.symbol]: ccy.toBaseUnit,
                }),
                {} as Record<CurrencySymbol, (value: number) => BigNumber>
            ),
        []
    );

    const assetPriceMap = useSelector((state: RootState) => getPriceMap(state));
    const assetList = useMemo(() => getCurrencyMapAsOptions(), []);

    const collateralUsagePercent = useMemo(() => {
        return percentFormat(
            BigNumber.from(collateralBook.coverage.toString()).toNumber() /
                100.0
        );
    }, [collateralBook]);

    const availableToBorrow = useMemo(() => {
        if (!currency) {
            return 0;
        }
        //TODO: Remove the usage of BigNumber.js and use only Ethers.js
        return `${computeAvailableToBorrow(
            assetPriceMap[currency],
            assetPriceMap[CurrencySymbol.ETH],
            BigNumber.from(collateralBook.collateral.toString())
        )}  ${currency}`;
    }, [assetPriceMap, collateralBook.collateral, currency]);

    //TODO: strongly type the terms
    const selectedTerm = useMemo(() => {
        return (
            maturitiesOptionList.find(option =>
                option.value.equals(maturity)
            ) || maturitiesOptionList[0]
        );
    }, [maturity, maturitiesOptionList]);

    const handlePlaceOrder = useCallback(
        async (
            ccy: CurrencySymbol,
            maturity: number | BigNumber,
            side: OrderSide,
            amount: BigNumber,
            rate: number
        ) => {
            try {
                setPendingTransaction(true);
                const tx = await onPlaceOrder(
                    ccy,
                    maturity,
                    side,
                    amount,
                    rate
                );
                const transactionStatus = await handleContractTransaction(tx);
                // TODO after placeOrder works
                if (!transactionStatus) {
                    console.error('Some error occurred');
                }
                setPendingTransaction(false);
            } catch (e) {
                if (e instanceof Error) {
                    setPendingTransaction(false);
                    dispatch(setLastMessage(e.message));
                }
            }
        },
        [onPlaceOrder, dispatch]
    );

    return (
        <div className='w-80 flex-col space-y-6 rounded-b-xl border border-panelStroke bg-transparent pb-6 shadow-deep'>
            <BorrowLendSelector
                handleClick={side => dispatch(setSide(side))}
                side={side}
                variant='simple'
            />

            <div className='grid justify-center space-y-6 px-4'>
                <div className='flex flex-col text-center'>
                    <span
                        className='typography-amount-large text-white'
                        data-testid='market-rate'
                    >
                        {marketRate.toPercent()}
                    </span>
                    <span className='typography-caption uppercase text-planetaryPurple'>
                        Fixed Rate APY
                    </span>
                </div>

                <AssetSelector
                    options={assetList}
                    selected={assetList[0]}
                    transformLabel={(v: string) => shortNames[v]}
                    priceList={assetPriceMap}
                    onAmountChange={(v: BigNumber) => dispatch(setAmount(v))}
                    amountFormatterMap={amountFormatterMap}
                    onAssetChange={(v: CurrencySymbol) => {
                        dispatch(setCurrency(v));
                    }}
                />

                <TermSelector
                    options={maturitiesOptionList.map(o => ({
                        ...o,
                        value: o.value.toString(),
                    }))}
                    selected={{
                        ...selectedTerm,
                        value: selectedTerm.value.toString(),
                    }}
                    onTermChange={v => dispatch(setMaturity(new Maturity(v)))}
                    transformLabel={v => {
                        const ts = maturitiesOptionList.find(
                            o => o.label === v
                        )?.value;
                        return ts ? formatDate(Number(ts)) : v;
                    }}
                />

                <CollateralUsageSection
                    available={availableToBorrow.toString()}
                    usage={collateralUsagePercent.toString()}
                />

                <Button
                    fullWidth
                    onClick={() =>
                        handlePlaceOrder(
                            currency,
                            maturity.getMaturity(),
                            side,
                            amount,
                            marketRate.toNumber()
                        )
                    }
                    disabled={pendingTransaction}
                    data-testid='place-order-button'
                >
                    {side === OrderSide.Borrow ? 'Borrow' : 'Lend'}
                </Button>
            </div>
        </div>
    );
};
