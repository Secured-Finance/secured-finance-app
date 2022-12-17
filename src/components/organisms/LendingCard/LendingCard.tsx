import { Side } from '@secured-finance/sf-client/dist/secured-finance-client';
import { BigNumber } from 'ethers';
import { useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { BorrowLendSelector, Button } from 'src/components/atoms';
import { CollateralUsageSection } from 'src/components/atoms/CollateralUsageSection';
import { AssetSelector, TermSelector } from 'src/components/molecules';
import { PlaceOrder } from 'src/components/organisms';
import { CollateralBook, usePlaceOrder } from 'src/hooks';
import { getPriceMap } from 'src/store/assetPrices/selectors';
import {
    selectLandingOrderForm,
    setAmount,
    setCurrency,
    setMaturity,
    setSide,
} from 'src/store/landingOrderForm';
import { RootState } from 'src/store/types';
import { MaturityOptionList } from 'src/types';
import {
    amountFormatterToBase,
    CurrencySymbol,
    formatDate,
    formatLoanValue,
    getCurrencyMapAsList,
    getCurrencyMapAsOptions,
    percentFormat,
} from 'src/utils';
import { computeAvailableToBorrow } from 'src/utils/collateral';
import { LoanValue, Maturity } from 'src/utils/entities';

export const LendingCard = ({
    collateralBook,
    marketValue,
    maturitiesOptionList,
}: {
    collateralBook: CollateralBook;
    marketValue: LoanValue;
    maturitiesOptionList: MaturityOptionList;
}) => {
    const [openPlaceOrder, setOpenPlaceOrder] = useState(false);
    const { placeOrder } = usePlaceOrder();

    const { currency, maturity, side } = useSelector((state: RootState) =>
        selectLandingOrderForm(state.landingOrderForm)
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

    const selectedAsset = useMemo(() => {
        return assetList.find(option => option.value === currency);
    }, [currency, assetList]);

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
                        {formatLoanValue(marketValue, 'rate')}
                    </span>
                    <span className='typography-caption uppercase text-planetaryPurple'>
                        Fixed Rate APY
                    </span>
                </div>

                <AssetSelector
                    options={assetList}
                    selected={selectedAsset}
                    transformLabel={(v: string) => shortNames[v]}
                    priceList={assetPriceMap}
                    onAmountChange={(v: BigNumber) => dispatch(setAmount(v))}
                    amountFormatterMap={amountFormatterToBase}
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
                    onClick={() => setOpenPlaceOrder(true)}
                    data-testid='place-order-button'
                >
                    {side === Side.BORROW ? 'Borrow' : 'Lend'}
                </Button>
                <PlaceOrder
                    isOpen={openPlaceOrder}
                    onClose={() => setOpenPlaceOrder(false)}
                    value={marketValue}
                    onPlaceOrder={placeOrder}
                />
            </div>
        </div>
    );
};
