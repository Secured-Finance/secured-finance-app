import { RadioGroup } from '@headlessui/react';
import { BigNumber } from 'ethers';
import { useCallback, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button, NavTab } from 'src/components/atoms';
import { CollateralUsageSection } from 'src/components/atoms/CollateralUsageSection';
import { AssetSelector, TermSelector } from 'src/components/molecules';
import { CollateralBook, OrderSide } from 'src/hooks';
import { getPriceMap } from 'src/store/assetPrices/selectors';
import {
    selectLandingOrderForm,
    setAmount,
    setCurrency,
    setSide,
    setTerm,
} from 'src/store/landingOrderForm';
import { setLastMessage } from 'src/store/lastError';
import { RootState } from 'src/store/types';
import {
    CurrencySymbol,
    getCurrencyMapAsList,
    getCurrencyMapAsOptions,
    getTermsAsOptions,
    percentFormat,
    Term,
    termMap,
} from 'src/utils';
import {
    collateralUsage,
    computeAvailableToBorrow,
} from 'src/utils/collateral';

export const LendingCard = ({
    onPlaceOrder,
    collateralBook,
    marketRate,
}: {
    onPlaceOrder: (
        ccy: CurrencySymbol,
        term: string,
        side: OrderSide,
        amount: BigNumber,
        rate: number
    ) => Promise<unknown>;
    collateralBook: CollateralBook;
    marketRate: number;
}) => {
    const [pendingTransaction, setPendingTransaction] = useState(false);
    const { currency, term, amount, side } = useSelector((state: RootState) =>
        selectLandingOrderForm(state.landingOrderForm)
    );

    const dispatch = useDispatch();

    const shortNames = useMemo(
        () =>
            getCurrencyMapAsList().reduce<Record<string, CurrencySymbol>>(
                (acc, ccy) => ({
                    ...acc,
                    [ccy.name]: ccy.shortName,
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
                    [ccy.shortName]: ccy.toBaseUnit,
                }),
                {} as Record<CurrencySymbol, (value: number) => BigNumber>
            ),
        []
    );

    const assetPriceMap = useSelector((state: RootState) => getPriceMap(state));
    const assetList = useMemo(() => getCurrencyMapAsOptions(), []);
    const optionList = useMemo(() => getTermsAsOptions(), []);

    const collateralUsagePercent = useMemo(() => {
        //TODO: Remove the usage of BigNumber.js and use only Ethers.js
        return percentFormat(
            collateralUsage(
                BigNumber.from(collateralBook.locked?.toString()),
                BigNumber.from(collateralBook.collateral.toString())
            )
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
            optionList.find(option => option.value === term) || optionList[0]
        );
    }, [term, optionList]);

    const handlePlaceOrder = useCallback(
        async (
            ccy: CurrencySymbol,
            term: Term,
            side: number,
            amount: BigNumber,
            rate: number
        ) => {
            try {
                setPendingTransaction(true);
                await onPlaceOrder(
                    ccy,
                    termMap[term].value,
                    side,
                    amount,
                    rate
                );
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
        <div className='w-80 flex-col space-y-6 rounded-b-xl border border-neutral bg-transparent pb-4 shadow-deep'>
            <RadioGroup
                value={side}
                onChange={(v: number) => dispatch(setSide(v))}
                as='div'
                className='flex flex-row items-center justify-around'
            >
                <RadioGroup.Option value={OrderSide.Borrow} className='w-1/2'>
                    {({ checked }) => <NavTab text='Borrow' active={checked} />}
                </RadioGroup.Option>
                <RadioGroup.Option
                    value={OrderSide.Lend}
                    as='div'
                    className='w-1/2'
                >
                    {({ checked }) => <NavTab text='Lend' active={checked} />}
                </RadioGroup.Option>
            </RadioGroup>

            <div className='grid justify-center space-y-4 px-4'>
                <div className='typography-body-2 flex flex-col text-center text-white-50'>
                    <span className='typography-big-body-bold text-white'>
                        {marketRate && marketRate / 100} %
                    </span>
                    <span>Fixed Rate APY</span>
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
                    options={optionList}
                    selected={selectedTerm}
                    onTermChange={(v: Term) => dispatch(setTerm(v))}
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
                            term,
                            side,
                            amount,
                            marketRate
                        )
                    }
                    disabled={pendingTransaction}
                    data-testid='place-order-button'
                >
                    {side ? 'Borrow' : 'Lend'}
                </Button>
            </div>
        </div>
    );
};
