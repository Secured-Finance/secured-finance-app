import { RadioGroup } from '@headlessui/react';
import classNames from 'classnames';
import { BigNumber } from 'ethers';
import { useCallback, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button } from 'src/components/atoms';
import { CollateralUsageSection } from 'src/components/atoms/CollateralUsageSection';
import { AssetSelector, TermSelector } from 'src/components/molecules';
import { CollateralBook, OrderSide } from 'src/hooks';
import { getPriceMap } from 'src/store/assetPrices/selectors';
import {
    setAmount,
    setCurrency,
    setSide,
    setTerm,
} from 'src/store/landingOrderForm';
import { setLastMessage } from 'src/store/lastError';
import { RootState } from 'src/store/types';
import {
    Currency,
    currencyList,
    getCurrencyMapAsOptions,
    getTermsAsOptions,
    percentFormat,
    Term,
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
        ccy: string,
        term: string,
        side: OrderSide,
        amount: number,
        rate: number
    ) => Promise<unknown>;
    collateralBook: CollateralBook;
    marketRate: number;
}) => {
    const [pendingTransaction, setPendingTransaction] = useState(false);
    const { currency, term, amount, side } = useSelector(
        (state: RootState) => state.landingOrderForm
    );

    const dispatch = useDispatch();

    const shortNames = useMemo(
        () =>
            currencyList.reduce<Record<string, Currency>>(
                (acc, ccy) => ({
                    ...acc,
                    [ccy.name]: ccy.shortName,
                }),
                {}
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
                BigNumber.from(collateralBook.locked.toString()),
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
            assetPriceMap[Currency.ETH],
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
            ccy: string,
            term: string,
            side: number,
            amount: number,
            rate: number
        ) => {
            try {
                setPendingTransaction(true);
                await onPlaceOrder(ccy, term, side, amount, rate);
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
        <div className='w-80 flex-col space-y-6 rounded-xl border border-neutral bg-transparent pb-4 shadow-2xl'>
            <RadioGroup
                value={side}
                onChange={(v: number) => dispatch(setSide(v))}
                as='div'
                className='grid grid-flow-col grid-cols-2'
            >
                <RadioGroup.Option value={OrderSide.Borrow} as='div'>
                    {({ checked }) => (
                        <RadioGroup.Label
                            className={classNames({
                                'ring ring-red': checked,
                            })}
                        >
                            <Button fullWidth>Borrow</Button>
                        </RadioGroup.Label>
                    )}
                </RadioGroup.Option>
                <RadioGroup.Option value={OrderSide.Lend} as='div'>
                    {({ checked }) => (
                        <RadioGroup.Label
                            className={classNames({
                                'ring ring-red': checked,
                            })}
                        >
                            <Button fullWidth>Lend</Button>
                        </RadioGroup.Label>
                    )}
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
                    onAmountChange={(v: number) => dispatch(setAmount(v))}
                    onAssetChange={(v: Currency) => {
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
