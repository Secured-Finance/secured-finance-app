import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { GradientBox, Option, Separator } from 'src/components/atoms';
import {
    HorizontalAssetSelector,
    HorizontalTab,
} from 'src/components/molecules';
import {
    AdvancedLendingOrderCard,
    OrderWidget,
} from 'src/components/organisms';
import { Page } from 'src/components/templates';
import { TwoColumnsWithTopBar } from 'src/components/templates/TwoColumnsWithTopBar';
import { useCollateralBook } from 'src/hooks';
import { useOrderbook } from 'src/hooks/useOrderbook';
import {
    selectLandingOrderForm,
    setCurrency,
    setMaturity,
} from 'src/store/landingOrderForm';
import { RootState } from 'src/store/types';
import { CurrencySymbol, getCurrencyMapAsOptions } from 'src/utils';
import { Maturity } from 'src/utils/entities';
import { useWallet } from 'use-wallet';
import { emptyOptionList } from '..';
const Toolbar = ({
    selectedAsset,
    assetList,
    options,
    selected,
}: {
    selectedAsset: Option<CurrencySymbol> | undefined;
    assetList: Array<Option<CurrencySymbol>>;
    options: Array<Option<string>>;
    selected: Option<string>;
}) => {
    return (
        <GradientBox shape='rectangle'>
            <div className='flex min-w-fit flex-row items-center justify-between px-6 py-3'>
                <HorizontalAssetSelector
                    assetList={assetList}
                    selectedAsset={selectedAsset}
                    options={options}
                    selected={selected}
                    onAssetChange={v => {
                        setCurrency(v);
                    }}
                    onTermChange={v => {
                        setMaturity(new Maturity(v));
                    }}
                />
                <div className='flex flex-row items-center justify-start'>
                    <div className='flex'>Pre Open</div>
                    <div className='flex'>Open</div>
                </div>
            </div>
        </GradientBox>
    );
};
export const Itayose = () => {
    const { account } = useWallet();

    const { currency, maturity } = useSelector((state: RootState) =>
        selectLandingOrderForm(state.landingOrderForm)
    );
    const lendingContracts = useSelector(
        (state: RootState) => state.availableContracts.lendingMarkets[currency]
    );

    const optionList = Object.entries(lendingContracts)
        .filter(o => !o[1].isActive)
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
        <Page title='Itayose'>
            <TwoColumnsWithTopBar
                topBar={
                    <Toolbar
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
                        <div className='rounded-b-2xl border-l border-r border-b border-white-10 bg-gradient-to-b from-[rgba(111,116,176,0.35)] to-[rgba(57,77,174,0)] px-5 shadow-tab'>
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
                                Finance does not charge any fees for placing
                                orders during the pre-order period. To learn
                                more about pre-market orders and how we
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
                            <OrderWidget
                                currency={currency}
                                buyOrders={orderBook.borrowOrderbook}
                                sellOrders={orderBook.lendOrderbook}
                            />
                        </HorizontalTab>
                    </div>
                </div>
            </TwoColumnsWithTopBar>
        </Page>
    );
};
