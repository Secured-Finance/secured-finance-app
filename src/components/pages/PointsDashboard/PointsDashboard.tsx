import {
    ClipboardDocumentIcon,
    ShareIcon,
    TrophyIcon,
} from '@heroicons/react/24/outline';
import {
    QuestType,
    useGetQuestsQuery,
    useGetUsersQuery,
    useNonceQuery,
} from 'src/generated/points';
import { snakeCase } from 'change-case';
import clsx from 'clsx';
import dayjs from 'dayjs';
import { useRouter } from 'next/router';
import { useMemo, useState, useCallback } from 'react';
import CountUp from 'react-countup';
import { useDispatch, useSelector } from 'react-redux';
import { SiweMessage } from 'siwe';
import {
    Button,
    ButtonSizes,
    Chip,
    ChipColors,
    CurrencyIcon,
    GradientBox,
    Identicon,
    Separator,
    Spinner,
    StatsBox,
    TextLink,
} from 'src/components/atoms';
import { Alert, InfoToolTip, Tooltip } from 'src/components/molecules';
import {
    DepositCollateral,
    generateCollateralList,
} from 'src/components/organisms';
import { Page, TwoColumns } from 'src/components/templates';
import {
    useCollateralBalances,
    useCollateralCurrencies,
    usePoints,
} from 'src/hooks';
import { setWalletDialogOpen } from 'src/store/interactions';
import { RootState } from 'src/store/types';
import {
    CurrencySymbol,
    MaturityConverter,
    SupportedChainsList,
    readWalletFromStore,
    PriceFormatter,
    FORMAT_DIGITS,
} from 'src/utils';
import { useAccount, useConnect, useSignMessage } from 'wagmi';
import { getShareMessage, quoteTweetUrl } from './constants';

const POLL_INTERVAL = 600000; // 10 minutes

const ReferralCode = ({ code }: { code: string }) => {
    const shareMessage = getShareMessage(code);

    return (
        <div className='flex h-28 w-full flex-col items-center justify-center'>
            <div className='flex h-7 flex-row items-center gap-2'>
                <div className='typography-caption-2 h-5 w-full text-center text-secondary7'>
                    Referral Code
                </div>
                <InfoToolTip align='top-right'>
                    Share your referral link with friends and start earning. Get
                    5% of their points and give them a 5% boost with your code!
                </InfoToolTip>
            </div>

            <span
                className='typography-body-1 h-12 w-full text-center text-white'
                data-testid='portfolio-tab-value'
            >
                <div className='mx-4 grid h-12 grid-flow-col items-center gap-x-3 rounded-xl border border-neutral-3 bg-black-20 px-2'>
                    <div className='typography-caption overflow-auto text-white-60'>
                        <div className='flex w-full flex-row items-center justify-between'>
                            <div className='truncate'>{code}</div>
                            <div className='float-right flex flex-row items-center justify-between  gap-2 text-right'>
                                <Tooltip
                                    iconElement={
                                        <button
                                            type='button'
                                            className='flex h-8 w-8 items-center justify-center rounded-2xl bg-gunMetal'
                                            onClick={() =>
                                                navigator.clipboard.writeText(
                                                    `${
                                                        window.location.origin +
                                                        window.location.pathname
                                                    }?ref=${code}`
                                                )
                                            }
                                        >
                                            <ClipboardDocumentIcon className='h-5 w-5 text-slateGray hover:text-planetaryPurple' />
                                        </button>
                                    }
                                >
                                    Copy your referral link
                                </Tooltip>
                                {shareMessage && (
                                    <Tooltip
                                        iconElement={
                                            <button
                                                type='button'
                                                className='flex h-8 w-8 items-center justify-center rounded-2xl bg-gunMetal'
                                                onClick={() => {
                                                    window.open(
                                                        `https://x.com/intent/tweet?text=${shareMessage}&url=${quoteTweetUrl}`,
                                                        '_blank'
                                                    );
                                                }}
                                            >
                                                <ShareIcon className='h-5 w-5 text-slateGray hover:text-planetaryPurple' />
                                            </button>
                                        }
                                    >
                                        Share on X
                                    </Tooltip>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </span>
        </div>
    );
};

const UserPointInfo = ({ chainId }: { chainId: number }) => {
    const {
        user: { loading: loadingUser, data: userData },
        verification: {
            verify: verifyUser,
            loading: verifyLoading,
            data: verifiedData,
        },
    } = usePoints();
    const searchParams = new URLSearchParams(document.location.search);
    const referralCode = searchParams.get('ref');
    const questTypes = [
        QuestType.Deposit,
        QuestType.LimitOrder,
        QuestType.ActivePosition,
        QuestType.Referral,
        QuestType.DailyLogin,
    ];
    const questTypeLabels = {
        [QuestType.DailyLogin]: 'Daily Login Points',
        [QuestType.Deposit]: 'Deposit Points',
        [QuestType.LimitOrder]: 'Open Order Points',
        [QuestType.ActivePosition]: 'Active Position Points',
        [QuestType.Referral]: 'Refer Friend Points',
    };
    const fetchNonce = useCallback(async () => {
        const fetcher = useNonceQuery.fetcher(undefined);
        const nonceData = await fetcher();
        return { data: nonceData };
    }, []);
    const { isLoading, signMessageAsync, reset } = useSignMessage();
    const { address, isConnected } = useAccount();
    const dispatch = useDispatch();

    return (
        <GradientBox>
            {verifiedData && address && userData ? (
                <>
                    <div className='items-center pb-2 pt-8 text-center text-lg font-bold text-white'>
                        Total Points
                    </div>
                    <div className='typography-body-1 flex w-full flex-row items-center justify-center border-b border-white-10 pb-8 text-2xl text-white'>
                        <div className='pr-2'>
                            {address && <Identicon value={address} size={36} />}
                        </div>
                        <CountUp
                            start={0}
                            end={userData?.user.point ?? 0}
                            duration={2}
                            decimals={0}
                            preserveValue={true}
                            delay={0}
                        />
                    </div>

                    <div
                        className={clsx(
                            `grid grid-cols-2 grid-rows-1`,
                            questTypes.length > 2
                                ? 'grid-rows-2 tablet:grid-cols-4  tablet:grid-rows-1'
                                : ''
                        )}
                        role='grid'
                    >
                        {questTypes.map(questType => (
                            <div
                                key={questType}
                                className={
                                    'border-white-10 odd:border-r tablet:last:border-none tablet:even:border-r'
                                }
                            >
                                <StatsBox
                                    key={questType}
                                    name={questTypeLabels[questType]}
                                    value={String(
                                        userData?.user.pointDetails?.[
                                            snakeCase(questType)
                                        ] ?? 0
                                    )}
                                />
                                {
                                    <div>
                                        <Separator
                                            orientation='horizontal'
                                            color='white-10'
                                        />
                                    </div>
                                }
                            </div>
                        ))}
                        <div className={'border-r border-white-10'}>
                            <div className='flex h-full w-full flex-col items-center justify-center overflow-hidden'>
                                <span className='typography-caption-2 h-5 w-full text-center text-secondary7'>
                                    Your Rank
                                </span>
                                <div className='flex items-center justify-center'>
                                    <div className='mr-2 h-6 w-6'>
                                        <TrophyIcon className='h-full w-full text-slateGray hover:text-planetaryPurple' />
                                    </div>

                                    <div className='typography-body-1 h-8 text-center text-md text-white'>
                                        {userData?.user.rank || '-'}
                                    </div>
                                </div>
                            </div>
                            <Separator
                                orientation='horizontal'
                                color='white-10'
                            />
                        </div>
                        <div className={'border-r border-white-10'}>
                            <div className='flex h-full w-full flex-col items-center justify-center overflow-hidden'>
                                <span className='typography-caption-2 h-5 w-full text-center text-secondary7'>
                                    Point Boost
                                </span>
                                <div className='typography-body-1 h-8 text-center text-md text-white'>
                                    +{' '}
                                    {PriceFormatter.formatPercentage(
                                        userData?.user.boostPercentage / 100,
                                        'percentage'
                                    )}
                                </div>
                            </div>
                            <Separator
                                orientation='horizontal'
                                color='white-10'
                            />
                        </div>
                        <div>
                            <ReferralCode
                                code={userData?.user.referralCode || ''}
                            />
                            <Separator
                                orientation='horizontal'
                                color='white-10'
                            />
                        </div>
                    </div>
                </>
            ) : (
                <div className='flex min-h-[378px] flex-col items-center justify-center border-b border-white-10 p-6'>
                    {loadingUser ? (
                        <div className='flex h-36 w-full items-center justify-center'>
                            <Spinner />
                        </div>
                    ) : (
                        <>
                            <p className='text-center text-lg text-white'>
                                Join the Secured Finance Points Program!
                            </p>
                            {referralCode && (
                                <p className='mt-2 text-center text-secondary7'>
                                    Referral Code: {referralCode}
                                </p>
                            )}
                            <Button
                                className='mx-auto mt-4'
                                size={ButtonSizes.lg}
                                onClick={async () => {
                                    if (!isConnected) {
                                        dispatch(setWalletDialogOpen(true));
                                        return;
                                    }

                                    const result = await fetchNonce();
                                    const { data: nonceData } = result;

                                    const message = new SiweMessage({
                                        domain: window.location.host,
                                        address,
                                        statement:
                                            'Join the Secured Finance points program!',
                                        uri: window.location.origin,
                                        version: '1',
                                        chainId: chainId,
                                        nonce: nonceData.nonce,
                                    });

                                    const signature = await signMessageAsync({
                                        message: message.prepareMessage(),
                                    });

                                    await verifyUser({
                                        input: {
                                            signature,
                                            message: JSON.stringify(message),
                                            referralCode,
                                        },
                                    });

                                    reset();
                                }}
                                disabled={isLoading || verifyLoading}
                            >
                                {!isConnected ? 'Connect Wallet' : 'Join'}
                            </Button>
                        </>
                    )}
                </div>
            )}
        </GradientBox>
    );
};

const QuestList = ({ chainId }: { chainId: number }) => {
    const [isOpenDepositModal, setIsOpenDepositModal] =
        useState<boolean>(false);
    const [isDefaultDepositCcySymbol, setIsDefaultDepositCcySymbol] = useState<
        string | undefined
    >(undefined);
    const { connectors } = useConnect();
    const { data, isLoading: loading } = useGetQuestsQuery(undefined, {
        refetchInterval: POLL_INTERVAL,
    });
    const collateralBalances = useCollateralBalances();
    const { data: collateralCurrencies = [] } = useCollateralCurrencies();
    const depositCollateralList = useMemo(
        () =>
            generateCollateralList(
                collateralBalances,
                false,
                collateralCurrencies
            ),
        [collateralBalances, collateralCurrencies]
    );

    const provider = readWalletFromStore();
    const connector = connectors.find(connect => connect.name === provider);

    const PointTag = ({
        point,
        questType,
        isHighlight,
    }: {
        point: number;
        questType: QuestType;
        isHighlight: boolean;
    }) => {
        const suffix = [QuestType.DailyLogin, QuestType.Referral].includes(
            questType
        )
            ? 'pt'
            : 'pt / $ / day';

        return (
            <div className='whitespace-nowrap'>
                <Chip
                    label={point.toString() + suffix}
                    color={isHighlight ? ChipColors.Yellow : ChipColors.Blue}
                />
            </div>
        );
    };

    const BonusPointTags = ({
        bonusPoints,
        questType,
        questPoint,
    }: {
        bonusPoints: Record<string, number>;
        questType: QuestType;
        questPoint: number;
    }) => {
        const BonusPointTag = ({
            label,
            color,
        }: {
            label: string;
            color: ChipColors;
        }) => (
            <div className='whitespace-nowrap'>
                <Chip label={label} color={color} />
            </div>
        );

        const bonusPointTags = useMemo(() => {
            const tags = [];
            if (questType === QuestType.LimitOrder) {
                if (bonusPoints['lend'] > 0) {
                    tags.push(
                        <div className='pl-2' key={'lend'}>
                            <BonusPointTag
                                label={`LEND ${Number(
                                    PriceFormatter.formatToFixed(
                                        (questPoint + bonusPoints['lend']) /
                                            questPoint,
                                        FORMAT_DIGITS.ONE
                                    )
                                )}x`}
                                color={ChipColors.Teal}
                            />
                        </div>
                    );
                }
                if (bonusPoints['borrow'] > 0) {
                    tags.push(
                        <div className='pl-2' key={'borrow'}>
                            <BonusPointTag
                                label={`BORROW ${Number(
                                    PriceFormatter.formatToFixed(
                                        (questPoint + bonusPoints['borrow']) /
                                            questPoint,
                                        FORMAT_DIGITS.ONE
                                    )
                                )}x`}
                                color={ChipColors.Red}
                            />
                        </div>
                    );
                }
            }
            return tags;
        }, [bonusPoints, questPoint, questType]);

        return <>{bonusPointTags}</>;
    };

    const QuestActionButton = ({
        questType,
        questChainId,
        questCurrencies,
        startAt,
    }: {
        questType: QuestType;
        questChainId?: number | null;
        questCurrencies?: string[] | null;
        startAt: string | null;
    }) => {
        const router = useRouter();

        let label: string | undefined;
        let call: () => void | undefined;

        if (questChainId && questCurrencies) {
            switch (questType) {
                case QuestType.Deposit:
                    label = 'Deposit';
                    call = () => {
                        setIsDefaultDepositCcySymbol(questCurrencies[0]);
                        setIsOpenDepositModal(true);
                    };
                    break;
                case QuestType.LimitOrder:
                case QuestType.ActivePosition:
                    label =
                        questType === QuestType.LimitOrder ? 'Order' : 'Trade';
                    call = () => {
                        router.push('/');
                    };
                    break;
                default:
                    break;
            }
        }

        if (label) {
            return (
                <Button
                    size={ButtonSizes.md}
                    disabled={
                        startAt ? dayjs().isBefore(dayjs(startAt)) : false
                    }
                    onClick={() => {
                        if (questChainId !== chainId) {
                            connector
                                ?.switchChain?.(Number(questChainId))
                                .then(() => {
                                    setTimeout(() => call(), 500);
                                });
                        } else {
                            call();
                        }
                    }}
                >
                    {label}
                </Button>
            );
        } else {
            return <></>;
        }
    };

    return (
        <GradientBox header='Active Quests'>
            <div className='flex h-fit w-full flex-col gap-3 p-3 '>
                {loading && (
                    <div className='flex h-36 w-full items-center justify-center'>
                        <Spinner />
                    </div>
                )}
                {data?.quests.map((item, index) => (
                    <div
                        key={`${item.title}-${index}`}
                        className='flex flex-col gap-2 rounded-xl border border-neutral-600 bg-neutral-900 p-4'
                    >
                        <div className='flex flex-row items-center justify-between text-grayScale'>
                            <div className='flex flex-row items-center'>
                                {item.chainId && (
                                    <div className='min-w-[1rem] pr-2'>
                                        {
                                            SupportedChainsList.find(
                                                ({ chain }) =>
                                                    chain.id === item.chainId
                                            )?.icon
                                        }
                                    </div>
                                )}
                                <div className='pr-4 text-md'>{item.title}</div>
                            </div>
                            <QuestActionButton
                                questType={item.questType}
                                questChainId={item.chainId}
                                questCurrencies={item.currencies}
                                startAt={item.startAt}
                            />
                        </div>

                        <div className='typography-caption-2 flex flex-row items-center text-secondary7'>
                            <PointTag
                                point={item.point}
                                questType={item.questType}
                                isHighlight={item.isHighlight}
                            />
                            {item.bonusPoints && (
                                <BonusPointTags
                                    bonusPoints={item.bonusPoints}
                                    questType={item.questType}
                                    questPoint={item.point}
                                />
                            )}
                            {item.currencies && (
                                <div className='flex pl-3'>
                                    {item.currencies.map(ccy => (
                                        <div className='-ml-1' key={ccy}>
                                            <CurrencyIcon
                                                ccy={ccy as CurrencySymbol}
                                                variant='small'
                                                key={ccy}
                                            />
                                        </div>
                                    ))}
                                </div>
                            )}
                            {(item.startAt || item.endAt) && (
                                <div className='pl-2'>
                                    {`${MaturityConverter.toDateStringFromRaw(
                                        item.startAt
                                    )} ~ ${MaturityConverter.toDateStringFromRaw(
                                        item.endAt
                                    )}`}
                                </div>
                            )}
                        </div>
                        <div className='flex flex-row items-center justify-between whitespace-pre-wrap text-sm text-grayScale'>
                            {item.description.replaceAll('\\n', '\n')}
                        </div>
                    </div>
                ))}
            </div>
            <DepositCollateral
                isOpen={isOpenDepositModal}
                onClose={() => setIsOpenDepositModal(false)}
                collateralList={depositCollateralList}
                source={'PointsDashboard'}
                defaultCcySymbol={isDefaultDepositCcySymbol}
            />
        </GradientBox>
    );
};

const Leaderboard = () => {
    const { data, isLoading: loading } = useGetUsersQuery(
        { page: 1, limit: 30 },
        {
            refetchInterval: POLL_INTERVAL,
        }
    );

    return (
        <GradientBox header='Leaderboard'>
            {loading && (
                <div className='flex h-36 w-full items-center justify-center'>
                    <Spinner />
                </div>
            )}
            <div>
                {data?.users.map(item => (
                    <div
                        key={`${item.walletAddress}`}
                        className='flex items-center justify-between border-b border-white-10 p-4 last:border-none'
                    >
                        <div className='w-10 pr-4 text-slateGray'>
                            {item.rank}
                        </div>
                        <div>
                            <Identicon value={item.walletAddress} size={24} />
                        </div>
                        <div className='truncate pl-4 pr-8 text-secondary7'>
                            {item.walletAddress}
                        </div>
                        <div className='float-right flex-1 text-right text-neutral-6'>
                            {PriceFormatter.formatOrdinary(
                                item.point,
                                FORMAT_DIGITS.NONE,
                                FORMAT_DIGITS.PRICE,
                                'standard'
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </GradientBox>
    );
};

export const PointsDashboard = () => {
    const chainId = useSelector((state: RootState) => state.blockchain.chainId);
    return (
        <>
            <Page title='Points' name='point-dashboard'>
                <div className='px-3 laptop:px-0'>
                    <Alert
                        title={
                            <>
                                Earn SF Points with Your Contributions to the
                                Secured Finance Protocol. Learn more about the
                                points system and calculations at the&nbsp;
                                <TextLink
                                    href='https://docs.secured.finance/top/secured-finance-points-sfp'
                                    text='Secured Finance Docs'
                                />
                            </>
                        }
                        isShowCloseButton={false}
                    />
                </div>
                <TwoColumns>
                    <div className='grid grid-cols-1 gap-y-7'>
                        <UserPointInfo chainId={chainId} />
                        <QuestList chainId={chainId} />
                    </div>
                    <Leaderboard />
                </TwoColumns>
            </Page>
        </>
    );
};
