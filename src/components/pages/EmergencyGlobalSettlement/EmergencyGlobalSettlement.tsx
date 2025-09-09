import { useEffect, useMemo, useState } from 'react';
import { GradientBox, TextLink } from 'src/components/atoms';
import { CollateralSnapshot } from 'src/components/molecules';
import {
    EmergencyRedeemDialog,
    MyWalletWidget,
    WithdrawPositionTable,
    WithdrawTokenTable,
    WithdrawablePosition,
} from 'src/components/organisms';
import { Page, TwoColumns } from 'src/components/templates';
import {
    emptyCollateralBook,
    emptyOrderList,
    useCollateralBook,
    useCurrenciesForOrders,
    useIsRedemptionRequired,
    useMarketTerminationDate,
    useMarketTerminationRatio,
    useOrderList,
    usePositions,
    useTerminationPrices,
} from 'src/hooks';
import { ZERO_BI, computeNetValue, HexConverter, formatter } from 'src/utils';
import { useAccount } from 'wagmi';

export const EmergencyGlobalSettlement = () => {
    const { address } = useAccount();

    const { data: usedCurrencies = [] } = useCurrenciesForOrders(address);
    const { data: orders = emptyOrderList } = useOrderList(
        address,
        usedCurrencies
    );
    const { data: positions } = usePositions(address, usedCurrencies);
    const { data: collateralBook = emptyCollateralBook } =
        useCollateralBook(address);

    const withdrawableData = useMemo(() => {
        const aggregated = orders.activeOrderList
            .filter(o => o.side === 0) // only lend orders
            .reduce((acc, o) => {
                const key = o.currency;
                const amount = acc.get(key) ?? ZERO_BI;
                acc.set(key, amount + o.amount);
                return acc;
            }, new Map<string, bigint>());

        const lendOrders: WithdrawablePosition[] = [];
        aggregated.forEach((v, k) => {
            lendOrders.push({
                amount: v,
                currency: k,
                futureValue: ZERO_BI,
                maturity: '0',
                type: 'lending-order' as const,
            });
        });

        const userPositions = positions ? positions.positions : [];

        return [
            ...lendOrders,
            ...userPositions.map(p => ({
                ...p,
                type: 'position' as const,
            })),
            ...Object.entries(collateralBook.collateral)
                .filter(v => v[1] && v[1] !== ZERO_BI)
                .map(([key, value]) => ({
                    amount: value,
                    currency: HexConverter.toHex(key),
                    futureValue: ZERO_BI,
                    maturity: '0',
                    type: 'collateral' as const,
                })),
        ];
    }, [orders.activeOrderList, positions, collateralBook.collateral]);

    const withdrawableTokens = [
        ...Object.entries(collateralBook.nonCollateral)
            .filter(v => v[1] && v[1] !== ZERO_BI)
            .map(([key, value]) => ({
                amount: value,
                currency: HexConverter.toHex(key),
            })),
        ...Object.entries(collateralBook.withdrawableCollateral)
            .filter(v => v[1] && v[1] !== ZERO_BI)
            .map(([key, value]) => ({
                amount: value,
                currency: HexConverter.toHex(key),
            })),
    ];

    const snapshot = useMarketTerminationRatio().data;
    const snapshotPrices = useTerminationPrices().data;
    const snapshotWithPrice =
        snapshot?.map(s => ({
            ...s,
            price: snapshotPrices?.[s.currency] ?? 0,
        })) ?? [];

    const { data: isRedemptionRequired, refetch } =
        useIsRedemptionRequired(address);

    const [userStep, setUserStep] = useState<'redeem' | 'withdraw'>('redeem');
    const [showRedeemDialog, setShowRedeemDialog] = useState(false);

    const snapshotDate = useMarketTerminationDate().data;

    useEffect(() => {
        if (isRedemptionRequired) {
            setUserStep('redeem');
        } else {
            setUserStep('withdraw');
        }
    }, [isRedemptionRequired]);

    const netValue = useMemo(() => {
        if (!snapshotPrices) return 0;
        return computeNetValue(withdrawableData, snapshotPrices);
    }, [withdrawableData, snapshotPrices]);

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
                                resulting collateral tokens.
                            </p>
                            <p>
                                For a comprehensive understanding of the
                                Emergency Global Settlement procedure, we
                                encourage you to explore the{' '}
                                <TextLink
                                    href='https://docs.secured.finance/fixed-income-protocol-guide/security-and-safety-measures/emergency-global-settlement'
                                    text='official docs'
                                />
                                .
                            </p>
                        </div>
                    </GradientBox>

                    <WithdrawPositionTable
                        data={userStep === 'redeem' ? withdrawableData : []}
                        onRedeem={() => {
                            setShowRedeemDialog(true);
                        }}
                        netValue={netValue}
                    />
                    <WithdrawTokenTable
                        data={userStep === 'withdraw' ? withdrawableTokens : []}
                    />
                </section>
                <section className='grid grid-flow-row gap-6'>
                    <CollateralSnapshot
                        data={snapshotWithPrice}
                        snapshotDate={snapshotDate}
                    />
                    <MyWalletWidget hideBridge />
                </section>
            </TwoColumns>
            <EmergencyRedeemDialog
                isOpen={showRedeemDialog}
                onClose={async () => {
                    setShowRedeemDialog(false);
                    await refetch();
                }}
                data={snapshotWithPrice ?? []}
                snapshotDate={snapshotDate}
                netValue={formatter.usd(netValue, 2)}
            />
        </Page>
    );
};
