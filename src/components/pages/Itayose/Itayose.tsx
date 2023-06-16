import { useMemo } from 'react';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { BigNumber } from 'ethers';
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
} from 'src/components/organisms';
import { Page } from 'src/components/templates';
import { TwoColumnsWithTopBar } from 'src/components/templates/TwoColumnsWithTopBar';
import { useCollateralBook } from 'src/hooks';
import { useOrderbook } from 'src/hooks/useOrderbook';
import { getAssetPrice } from 'src/store/assetPrices/selectors';
import {
    selectLandingOrderForm,
    setCurrency,
    setMaturity,
    setAmount,
} from 'src/store/landingOrderForm';
import { RootState } from 'src/store/types';
import { CurrencySymbol, getCurrencyMapAsOptions, usdFormat } from 'src/utils';
import { countdown } from 'src/utils/date';
import { Maturity } from 'src/utils/entities';
import { useWallet } from 'use-wallet';
import { emptyOptionList } from '..';

const Toolbar = ({
    selectedAsset,
    assetList,
    options,
    selected,
    date,
    nextMarketPhase,
    currency,
}: {
    selectedAsset: Option<CurrencySymbol> | undefined;
    assetList: Array<Option<CurrencySymbol>>;
    options: Array<Option<string>>;
    selected: Option<string>;
    date: number;
    nextMarketPhase: string;
    currency: CurrencySymbol;
}) => {
    const currencyPrice = useSelector((state: RootState) =>
        getAssetPrice(currency)(state)
    );
    const dispatch = useDispatch();

    const handleAssetChange = (v: CurrencySymbol) => {
        if (v === currency) return;
        dispatch(setCurrency(v));
        dispatch(setAmount(BigNumber.from(0)));
    };

    return (
        <GradientBox shape='rectangle'>
            <div className='flex min-w-fit flex-row items-center justify-between gap-20 px-6 py-3'>
                <HorizontalAssetSelector
                    assetList={assetList}
                    selectedAsset={selectedAsset}
                    options={options}
                    selected={selected}
                    onAssetChange={handleAssetChange}
                    onTermChange={v => {
                        dispatch(setMaturity(new Maturity(v)));
                    }}
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
    const { account } = useWallet();

    const { currency, maturity, marketPhase } = useSelector(
        (state: RootState) => selectLandingOrderForm(state.landingOrderForm)
    );

    const lendingContracts = useSelector(
        (state: RootState) => state.availableContracts.lendingMarkets[currency],
        shallowEqual
    );

    const optionList = Object.entries(lendingContracts)
        .filter(o => !o[1].isReady)
        .map(o => ({
            label: o[0],
            value: new Maturity(o[1].maturity),
        }));

    const maturityOptionList = useMemo(() => {
        return optionList.length > 0 ? optionList : emptyOptionList;
    }, [optionList]);

    const selectedTerm = useMemo(() => {
        return (
            maturityOptionList.find(option => option.value.equals(maturity)) ||
            maturityOptionList[0]
        );
    }, [maturity, maturityOptionList]);

    const assetList = useMemo(() => getCurrencyMapAsOptions(), []);
    const selectedAsset = useMemo(() => {
        return assetList.find(option => option.value === currency);
    }, [currency, assetList]);

    const orderBook = useOrderbook(currency, selectedTerm.value, 10);
    const collateralBook = useCollateralBook(account);

    return (
        <Page title='Pre-Open Order Book'>
            <TwoColumnsWithTopBar
                topBar={
                    <Toolbar
                        date={
                            marketPhase === 'PreOrder'
                                ? lendingContracts[selectedTerm.label]
                                      ?.preOpenDate
                                : lendingContracts[selectedTerm.label]
                                      ?.utcOpeningDate
                        }
                        nextMarketPhase={
                            marketPhase === 'PreOrder' ? 'PreOrder' : 'Open in'
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
                    />
                }
            >
                <div>
                    <AdvancedLendingOrderCard
                        collateralBook={collateralBook}
                        onlyLimitOrder
                    />
                </div>
                <div className='flex flex-col gap-4'>
                    <div>
                        <div className='h-1 bg-starBlue'></div>
                        <div className='rounded-b-2xl border-b border-l border-r border-white-10 bg-gradient-to-b from-[rgba(111,116,176,0.35)] to-[rgba(57,77,174,0)] px-5'>
                            <h1 className='typography-nav-menu-default whitespace-nowrap py-5 text-left text-neutral-8'>
                                Pre-Open Orders
                            </h1>
                            <Separator />
                            <p className='typography-nav-menu-default py-7 pr-7 text-white'>
                                Secured Finance offers a reliable pre-market
                                order feature for our users. This feature allows
                                you to place limit orders 48 hours before a new
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
                    </div>
                    <div>
                        <HorizontalTab
                            tabTitles={[
                                'Order Book',
                                'Market Trades',
                                'My Orders',
                                'My Trades',
                            ]}
                        >
                            <OrderBookWidget
                                currency={currency}
                                buyOrders={orderBook.borrowOrderbook}
                                sellOrders={orderBook.lendOrderbook}
                                hideMidPrice
                            />
                        </HorizontalTab>
                    </div>
                </div>
            </TwoColumnsWithTopBar>
        </Page>
    );
};
