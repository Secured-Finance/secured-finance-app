import { OrderSide } from '@secured-finance/sf-client';
import { BigNumber } from 'ethers';
import { useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { BorrowLendSelector } from 'src/components/atoms';
import { WalletSourceSelector } from 'src/components/atoms/WalletSourceSelector';
import {
    AssetSelector,
    CollateralUsageSection,
    TermSelector,
} from 'src/components/molecules';
import { OrderAction } from 'src/components/organisms';
import { CollateralBook } from 'src/hooks';
import { getPriceMap } from 'src/store/assetPrices/selectors';
import {
    selectLandingOrderForm,
    setAmount,
    setCurrency,
    setMaturity,
    setSide,
    setSourceAccount,
} from 'src/store/landingOrderForm';
import { RootState } from 'src/store/types';
import { walletSourceList } from 'src/stories/mocks/fixtures';
import { MaturityOptionList } from 'src/types';
import {
    CurrencySymbol,
    WalletSource,
    amountFormatterToBase,
    formatLoanValue,
    getCurrencyMapAsList,
    getCurrencyMapAsOptions,
    getTransformMaturityOption,
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
    const { currency, maturity, side, sourceAccount } = useSelector(
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

    const assetPriceMap = useSelector((state: RootState) => getPriceMap(state));
    const assetList = useMemo(() => getCurrencyMapAsOptions(), []);

    const selectedTerm = useMemo(() => {
        return (
            maturitiesOptionList.find(option =>
                option.value.equals(maturity)
            ) || maturitiesOptionList[0]
        );
    }, [maturity, maturitiesOptionList]);

    const selectedWalletSource = useMemo(() => {
        return (
            walletSourceList.find(w => w.source === sourceAccount) ||
            walletSourceList[0]
        );
    }, [sourceAccount]);

    const selectedAsset = useMemo(() => {
        return assetList.find(option => option.value === currency);
    }, [currency, assetList]);

    return (
        <div className='w-80 flex-col space-y-6 rounded-b-xl border border-panelStroke bg-transparent pb-6 shadow-deep'>
            <BorrowLendSelector
                handleClick={side => {
                    dispatch(setSide(side));
                    dispatch(setSourceAccount(WalletSource.METAMASK));
                }}
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
                        Fixed Rate APR
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
                    transformLabel={getTransformMaturityOption(
                        maturitiesOptionList
                    )}
                />

                {side === OrderSide.LEND && (
                    <WalletSourceSelector
                        optionList={walletSourceList}
                        selected={selectedWalletSource}
                        onChange={v => dispatch(setSourceAccount(v))}
                    />
                )}

                <CollateralUsageSection
                    usdCollateral={collateralBook.usdCollateral}
                    collateralCoverage={collateralBook.coverage.toNumber()}
                    currency={currency}
                />

                <OrderAction collateralBook={collateralBook} renderSide />
            </div>
        </div>
    );
};
