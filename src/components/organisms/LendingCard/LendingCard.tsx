import { RadioGroup } from '@headlessui/react';
import { BigNumber, ContractTransaction } from 'ethers';
import { useCallback, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button, NavTab, Option } from 'src/components/atoms';
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
    maturitiesOptionList: Option[];
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
            BigNumber.from(collateralBook.coverage.toString()).toNumber()
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
            maturitiesOptionList.find(option => option.value === maturity) ||
            maturitiesOptionList[0]
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
            <RadioGroup
                value={side}
                onChange={(v: OrderSide) => dispatch(setSide(v))}
                as='div'
                className='flex h-16 flex-row items-center justify-around'
            >
                <RadioGroup.Option
                    value={OrderSide.Borrow}
                    className='h-full w-1/2'
                    as='button'
                >
                    {({ checked }) => <NavTab text='Borrow' active={checked} />}
                </RadioGroup.Option>
                <RadioGroup.Option
                    value={OrderSide.Lend}
                    as='button'
                    className='h-full w-1/2'
                >
                    {({ checked }) => <NavTab text='Lend' active={checked} />}
                </RadioGroup.Option>
            </RadioGroup>

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
                    options={maturitiesOptionList}
                    selected={selectedTerm}
                    onTermChange={v => dispatch(setMaturity(v))}
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
                            BigNumber.from(maturity),
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
