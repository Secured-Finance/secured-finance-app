import { useSelector } from 'react-redux';
import { GradientBox } from 'src/components/atoms';
import { CollateralSnapshot } from 'src/components/molecules';
import {
    MyWalletWidget,
    WithdrawPositionTable,
    WithdrawTokenTable,
} from 'src/components/organisms';
import { Page, TwoColumns } from 'src/components/templates';
import {
    emptyCollateralBook,
    useCollateralBook,
    useCurrenciesForOrders,
    usePositions,
} from 'src/hooks';
import { getPriceMap } from 'src/store/assetPrices/selectors';
import { RootState } from 'src/store/types';
import { CurrencySymbol, ZERO_BN } from 'src/utils';
import { toHex } from 'viem';
import { useAccount } from 'wagmi';

export const EmergencyGlobalSettlement = () => {
    const { address } = useAccount();
    const priceList = useSelector((state: RootState) => getPriceMap(state));

    const { data: usedCurrencies = [] } = useCurrenciesForOrders(address);
    const { data: positions = [] } = usePositions(address, usedCurrencies);
    const { data: collateralBook = emptyCollateralBook } =
        useCollateralBook(address);

    const withdrawableData = [
        ...positions.map(p => ({
            ...p,
            type: 'position' as const,
        })),
        ...Object.entries(collateralBook.collateral)
            .filter(v => v[1] && !v[1].isZero())
            .map(([key, value]) => ({
                amount: value,
                currency: toHex(key),
                forwardValue: ZERO_BN,
                maturity: '0',
                type: 'collateral' as const,
            })),
    ];

    const withdrawableTokens = Object.entries(collateralBook.nonCollateral).map(
        ([key, value]) => ({
            amount: value,
            currency: toHex(key),
        })
    );

    const snapshot = Object.entries(collateralBook.withdrawableCollateral).map(
        ([key]) => ({
            currency: key as CurrencySymbol,
            ratio: 1000,
            price: priceList[key as CurrencySymbol],
        })
    );

    return (
        <Page title='Emergency Global Settlement'>
            <TwoColumns>
                <section className='typography-caption-2 grid grid-flow-row gap-6 text-white'>
                    <GradientBox variant='high-contrast'>
                        <div className='flex flex-col gap-4 px-6 py-8'>
                            <p>
                                At Secured Finance, security and trust are
                                paramount. Emergency Global Settlement procedure
                                underscores our dedication to protecting your
                                assets from unforeseen challenges like
                                cyberattacks or technical anomalies. If
                                necessary, our administrators can activate this
                                procedure, pausing all market activities and
                                setting the protocol to a non-operational
                                status. Users can then redeem assets based on
                                the latest cached feeds and withdraw the
                                resulting collateral tokens. For a comprehensive
                                understanding of the Emergency Global Settlement
                                procedure, we encourage you to explore
                                Docs.Secured.Finance.
                            </p>
                            <p>
                                For a comprehensive understanding of the
                                Emergency Global Settlement procedure, we
                                encourage you to explore Docs.Secured.Finance.
                            </p>
                        </div>
                    </GradientBox>
                    <WithdrawPositionTable data={withdrawableData} />
                    <WithdrawTokenTable data={withdrawableTokens} />
                </section>
                <section className='grid grid-flow-row gap-6'>
                    <CollateralSnapshot
                        data={snapshot}
                        snapshotDate={123456789}
                    />
                    <MyWalletWidget />
                </section>
            </TwoColumns>
        </Page>
    );
};
