import { RadioGroup } from '@headlessui/react';
import { BigNumber, ContractTransaction } from 'ethers';
import { useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    Button,
    CollateralManagementConciseTab,
    NavTab,
    Separator,
    Slider,
} from 'src/components/atoms';
import { BorrowLendSelector } from 'src/components/atoms/BorrowLendSelector';
import { OrderInputBox } from 'src/components/atoms/OrderInputBox';
import { CollateralBook, OrderSide, OrderType } from 'src/hooks';
import { getPriceMap } from 'src/store/assetPrices/selectors';
import {
    selectLandingOrderForm,
    setAmount,
    setOrderType,
    setRate,
    setSide,
} from 'src/store/landingOrderForm';
import { RootState } from 'src/store/types';
import {
    amountFormatterFromBase,
    CurrencySymbol,
    getFullDisplayBalanceNumber,
    ordinaryFormat,
} from 'src/utils';

export const AdvancedLendingOrderCard = ({
    collateralBook,
}: {
    onPlaceOrder?: (
        ccy: CurrencySymbol,
        maturity: number | BigNumber,
        side: OrderSide,
        amount: BigNumber,
        rate: number
    ) => Promise<ContractTransaction | undefined>;
    collateralBook: CollateralBook;
}) => {
    const { currency, amount, side, orderType, rate } = useSelector(
        (state: RootState) => selectLandingOrderForm(state.landingOrderForm)
    );

    const dispatch = useDispatch();

    const collateralUsagePercent = useMemo(() => {
        return collateralBook.coverage.toNumber() / 100.0;
    }, [collateralBook]);

    const balance = getFullDisplayBalanceNumber(
        collateralBook.usdCollateral.toNumber()
    );

    const priceList = useSelector((state: RootState) => getPriceMap(state));
    const price = priceList[currency];

    const getAmount = () => {
        let format = (x: BigNumber) => x.toNumber();
        if (
            currency &&
            amountFormatterFromBase &&
            amountFormatterFromBase[currency]
        ) {
            format = amountFormatterFromBase[currency];
        }
        return format(amount);
    };

    return (
        <div className='h-fit w-[350px] rounded-b-xl border border-white-10 bg-cardBackground bg-opacity-60 pb-7 shadow-tab'>
            <RadioGroup
                value={orderType}
                onChange={(v: OrderType) => {
                    dispatch(setOrderType(v));
                }}
                as='div'
                className='flex h-[60px] flex-row items-center justify-around'
            >
                <RadioGroup.Option
                    value={OrderType.MARKET}
                    className='h-full w-1/2'
                    as='button'
                >
                    {({ checked }) => (
                        <NavTab text={OrderType.MARKET} active={checked} />
                    )}
                </RadioGroup.Option>
                <RadioGroup.Option
                    value={OrderType.LIMIT}
                    as='button'
                    className='h-full w-1/2'
                >
                    {({ checked }) => (
                        <NavTab text={OrderType.LIMIT} active={checked} />
                    )}
                </RadioGroup.Option>
            </RadioGroup>

            <div className='flex w-full flex-col justify-center gap-6 px-4 pt-5'>
                <BorrowLendSelector
                    handleClick={side => dispatch(setSide(side))}
                    side={side}
                    variant='advanced'
                />
                <div className='flex flex-col gap-4'>
                    <OrderInputBox
                        field='Fixed Rate'
                        unit='%'
                        disabled={orderType === OrderType.MARKET}
                        initialValue={(rate / 10000.0).toString()}
                        onValueChange={v =>
                            dispatch(setRate((v as number) * 10000.0))
                        }
                    />
                    <OrderInputBox
                        field='Amount'
                        unit={currency}
                        asset={currency}
                        initialValue={getAmount().toString()}
                        onValueChange={v => dispatch(setAmount(v as BigNumber))}
                    />
                </div>
                <Slider onChange={() => {}} />
                <OrderInputBox
                    field='Total'
                    unit='USD'
                    disabled={true}
                    initialValue={ordinaryFormat(getAmount() * price, 4)}
                />

                <Button
                    fullWidth
                    onClick={() => {}}
                    data-testid='place-order-button'
                >
                    Place Order
                </Button>

                <Separator color='neutral-3'></Separator>

                <div className='typography-nav-menu-default text-neutral-8'>
                    Collateral Management
                </div>

                <CollateralManagementConciseTab
                    collateralCoverage={collateralUsagePercent}
                    totalCollateralInUSD={balance}
                />
            </div>
        </div>
    );
};
