import { BigNumber } from 'ethers';
import { useCallback, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    GradientBox,
    MarketTab,
    Option,
    Separator,
} from 'src/components/atoms';
import {
    HorizontalAssetSelector,
    HorizontalTab,
} from 'src/components/molecules';
import {
    AdvancedLendingOrderCard,
    OrderBookWidget,
    OrderTable,
} from 'src/components/organisms';
import { Page, ThreeColumnsWithTopBar } from 'src/components/templates';
import {
    MarketPhase,
    baseContracts,
    emptyCollateralBook,
    emptyOrderList,
    useCollateralBook,
    useCurrenciesForOrders,
    useLendingMarkets,
    useMarketPhase,
    useMaturityOptions,
    useOrderList,
} from 'src/hooks';
import { useOrderbook } from 'src/hooks/useOrderbook';
import { getAssetPrice } from 'src/store/assetPrices/selectors';
import {
    selectLandingOrderForm,
    setAmount,
    setCurrency,
    setMaturity,
} from 'src/store/landingOrderForm';
import { RootState } from 'src/store/types';
import {
    CurrencySymbol,
    amountFormatterFromBase,
    amountFormatterToBase,
    getCurrencyMapAsOptions,
    hexToCurrencySymbol,
    usdFormat,
} from 'src/utils';
import { countdown } from 'src/utils/date';
import { Maturity } from 'src/utils/entities';
import { useAccount } from 'wagmi';

const Toolbar = ({
    selectedAsset,
    assetList,
    options,
    selected,
    date,
    nextMarketPhase,
    currency,
    handleAssetChange,
    handleTermChange,
}: {
    selectedAsset: Option<CurrencySymbol> | undefined;
    assetList: Array<Option<CurrencySymbol>>;
    options: Array<Option<string>>;
    selected: Option<string>;
    date: number;
    nextMarketPhase: string;
    currency: CurrencySymbol;
    handleAssetChange: (v: CurrencySymbol) => void;
    handleTermChange: (v: string) => void;
}) => {
    const currencyPrice = useSelector((state: RootState) =>
        getAssetPrice(currency)(state)
    );

    return (
        <GradientBox shape='rectangle'>
            <div className='flex min-w-fit flex-row items-center justify-between gap-20 px-6 py-3'>
                <HorizontalAssetSelector
                    assetList={assetList}
                    selectedAsset={selectedAsset}
                    options={options}
                    selected={selected}
                    onAssetChange={handleAssetChange}
                    onTermChange={handleTermChange}
                />
                <div className='flex w-full flex-row items-center justify-between'>
                    <div>
                        <MarketTab
                            name={nextMarketPhase}
                            value={countdown(date * 1000)}
                        />
                    </div>
                    <div>
                        <MarketTab
                            name={`${currency} price`}
                            value={usdFormat(currencyPrice, 2)}
                        />
                    </div>
                </div>
            </div>
        </GradientBox>
    );
};

export const Itayose = () => {
    const { address } = useAccount();

    const { amount, currency, maturity } = useSelector((state: RootState) =>
        selectLandingOrderForm(state.landingOrderForm)
    );

    const { data: lendingMarkets = baseContracts } = useLendingMarkets();
    const lendingContracts = lendingMarkets[currency];

    const marketPhase = useMarketPhase(currency, maturity);

    const maturityOptionList = useMaturityOptions(
        lendingContracts,
        market => market.isPreOrderPeriod || market.isItayosePeriod
    );

    const selectedTerm = useMemo(() => {
        return (
            maturityOptionList.find(option =>
                option.value.equals(new Maturity(maturity))
            ) || maturityOptionList[0]
        );
    }, [maturity, maturityOptionList]);

    const assetList = useMemo(() => getCurrencyMapAsOptions(), []);
    const selectedAsset = useMemo(() => {
        return assetList.find(option => option.value === currency);
    }, [currency, assetList]);

    const orderBook = useOrderbook(currency, maturity);
    const { data: usedCurrencies = [] } = useCurrenciesForOrders(address);
    const { data: orderList = emptyOrderList } = useOrderList(
        address,
        usedCurrencies
    );
    const { data: collateralBook = emptyCollateralBook } =
        useCollateralBook(address);

    const filteredOrderList = useMemo(() => {
        return orderList.activeOrderList.filter(
            o =>
                hexToCurrencySymbol(o.currency) === currency &&
                o.maturity === selectedTerm.value.toString()
        );
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [JSON.stringify(orderList), selectedTerm.value.toNumber()]);

    const dispatch = useDispatch();

    const handleAssetChange = useCallback(
        (v: CurrencySymbol) => {
            let formatFrom = (x: BigNumber) => x.toNumber();
            if (amountFormatterFromBase && amountFormatterFromBase[currency]) {
                formatFrom = amountFormatterFromBase[currency];
            }
            let formatTo = (x: number) => BigNumber.from(x);
            if (amountFormatterToBase && amountFormatterToBase[v]) {
                formatTo = amountFormatterToBase[v];
            }
            dispatch(setAmount(formatTo(formatFrom(amount))));
            dispatch(setCurrency(v));
        },
        [amount, currency, dispatch]
    );

    return (
        <Page title='Pre-Open Order Book'>
            <ThreeColumnsWithTopBar
                topBar={
                    <Toolbar
                        date={
                            marketPhase === MarketPhase.PRE_ORDER
                                ? lendingContracts[
                                      selectedTerm.value.toNumber()
                                  ]?.preOpenDate
                                : lendingContracts[
                                      selectedTerm.value.toNumber()
                                  ]?.utcOpeningDate
                        }
                        nextMarketPhase={
                            marketPhase === MarketPhase.PRE_ORDER
                                ? 'PreOrder'
                                : 'Open in'
                        }
                        assetList={assetList}
                        selectedAsset={selectedAsset}
                        options={maturityOptionList.map(o => ({
                            label: o.label,
                            value: o.value.toString(),
                        }))}
                        selected={{
                            label: selectedTerm.label,
                            value: selectedTerm.value.toString(),
                        }}
                        currency={currency}
                        handleAssetChange={handleAssetChange}
                        handleTermChange={v => {
                            dispatch(setMaturity(Number(v)));
                        }}
                    />
                }
            >
                <AdvancedLendingOrderCard
                    collateralBook={collateralBook}
                    onlyLimitOrder
                />
                <OrderBookWidget
                    currency={currency}
                    orderbook={orderBook}
                    variant='itayose'
                />

                <div className='flex flex-col gap-4'>
                    <GradientBox variant='high-contrast'>
                        <div className='px-3'>
                            <h1 className='typography-nav-menu-default whitespace-nowrap py-5 text-left text-neutral-8'>
                                Pre-Open Orders
                            </h1>
                            <Separator />
                            <p className='typography-nav-menu-default py-7 pr-7 text-white'>
                                Secured Finance offers a reliable pre-market
                                order feature for our users. This feature allows
                                you to place limit orders 7 days before a new
                                orderbook starts trading to secure your position
                                in the market. Please note that no new
                                pre-orders will be accepted within 1 hour prior
                                to the start of trading.
                            </p>
                            <p className='typography-nav-menu-default pb-7 pr-7 text-white'>
                                Secured Finance does not charge any fees for
                                placing orders during the pre-order period. To
                                learn more about pre-market orders and how we
                                determine prices in Secured Finance GitBook.
                            </p>
                        </div>
                    </GradientBox>
                    <HorizontalTab tabTitles={['Open Orders']}>
                        <OrderTable
                            data={filteredOrderList}
                            variant='compact'
                        />
                    </HorizontalTab>
                </div>
            </ThreeColumnsWithTopBar>
        </Page>
    );
};
