import { OrderSide } from '@secured-finance/sf-client';
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
} from 'src/utils';
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
                    usdCollateral={collateralBook.usdCollateral}
                    collateralCoverage={collateralBook.coverage.toNumber()}
                    currency={currency}
                />

                <Button
                    fullWidth
                    onClick={() => setOpenPlaceOrder(true)}
                    data-testid='place-order-button'
                >
                    {side === OrderSide.BORROW ? 'Borrow' : 'Lend'}
                </Button>
                <PlaceOrder
                    isOpen={openPlaceOrder}
                    onClose={() => setOpenPlaceOrder(false)}
                    onPlaceOrder={placeOrder}
                />
            </div>
        </div>
    );
};
