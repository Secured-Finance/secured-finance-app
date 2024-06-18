import {
    ClipboardDocumentIcon,
    ShareIcon,
    TrophyIcon,
} from '@heroicons/react/24/outline';
import { formatDate } from '@secured-finance/sf-core';
import {
    QuestType,
    useGetQuestsQuery,
    useGetUserLazyQuery,
    useGetUsersQuery,
    useSignInMutation,
} from '@secured-finance/sf-point-client';
import { capitalCase, snakeCase } from 'change-case';
import clsx from 'clsx';
import dayjs from 'dayjs';
import { useEffect, useMemo, useState } from 'react';
import { useCookies } from 'react-cookie';
import CountUp from 'react-countup';
import { useSelector } from 'react-redux';
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
} from 'src/components/atoms';
import { InfoToolTip, Tooltip } from 'src/components/molecules';
import {
    DepositCollateral,
    generateCollateralList,
} from 'src/components/organisms';
import { Page, TwoColumns } from 'src/components/templates';
import { useCollateralBalances, useCollateralCurrencies } from 'src/hooks';
import { RootState } from 'src/store/types';
import {
    CurrencySymbol,
    SupportedChainsList,
    getReferralHashtags,
    getReferralMessage,
    ordinaryFormat,
    readWalletFromStore,
} from 'src/utils';
import { keccak256, stringToBytes } from 'viem';
import { useAccount, useConnect, useSignMessage } from 'wagmi';

const POLL_INTERVAL = 600000; // 10 minutes

const ReferralCode = ({ code }: { code: string }) => {
    return (
        <div className='flex h-28 w-full flex-col items-center justify-center'>
            <div className='flex h-7 flex-row items-center gap-2'>
                <div className='typography-caption-2 h-5 w-full text-center text-secondary7'>
                    Referral Code
                </div>
                <InfoToolTip align='top-right'>
                    Share your referral link with friends and start earning. Get
                    15% of their points and give them a 5% boost with your code!
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
                                <Tooltip
                                    iconElement={
                                        <button
                                            type='button'
                                            className='flex h-8 w-8 items-center justify-center rounded-2xl bg-gunMetal'
                                            onClick={() =>
                                                window.open(
                                                    `https://x.com/intent/tweet?text=${getReferralMessage()}&url=${
                                                        window.location.origin +
                                                        window.location.pathname
                                                    }?ref=${code}&hashtags=${getReferralHashtags()}`,
                                                    '_blank'
                                                )
                                            }
                                        >
                                            <ShareIcon className='h-5 w-5 text-slateGray hover:text-planetaryPurple' />
                                        </button>
                                    }
                                >
                                    Share on X
                                </Tooltip>
                            </div>
                        </div>
                    </div>
                </div>
            </span>
        </div>
    );
};

const UserPointInfo = () => {
    const searchParams = new URLSearchParams(document.location.search);
    const referralCode = searchParams.get('ref');
    const questTypes = [
        QuestType.DailyLogin,
        QuestType.Deposit,
        QuestType.LimitOrder,
        QuestType.ActivePosition,
        QuestType.Referral,
    ];
    const [timestamp, setTimestamp] = useState(new Date());
    const [cookies, setCookie, removeCookie] = useCookies();
    const { data: signature, isLoading, signMessage, reset } = useSignMessage();
    const { address, isConnected } = useAccount();
    const [signIn, { data: signInData, loading, error }] = useSignInMutation();
    const [getUser, { data: userData, loading: loadingUser, refetch }] =
        useGetUserLazyQuery({ pollInterval: POLL_INTERVAL });

    useEffect(() => {
        if (address && signature) {
            signIn({
                variables: {
                    input: {
                        walletAddress: address,
                        timestamp: timestamp.toISOString(),
                        signature,
                        referralCode,
                    },
                },
            });
            reset();
        }
    }, [signature, signIn, address, timestamp, reset, referralCode]);

    useEffect(() => {
        if (signInData) {
            const expires = dayjs().add(1, 'day').toDate();
            const signInDataText = {
                token: signInData?.signIn.token,
                walletAddress: signInData?.signIn.walletAddress,
            };
            setCookie('sign_in_data', signInDataText, {
                expires,
            });
        }
    }, [signInData, setCookie]);

    useEffect(() => {
        if (cookies.sign_in_data) {
            userData?.user.walletAddress &&
            userData?.user.walletAddress !== address
                ? refetch()
                : getUser();
        }
    }, [
        cookies.sign_in_data,
        getUser,
        address,
        userData?.user.walletAddress,
        refetch,
    ]);

    useEffect(() => {
        const walletAddress = cookies.sign_in_data?.walletAddress;
        if (error || (walletAddress && walletAddress !== address)) {
            removeCookie('sign_in_data');
        }
    }, [error, removeCookie, cookies.sign_in_data, address]);

    return (
        <GradientBox>
            {cookies.sign_in_data && userData ? (
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
                                    name={`${capitalCase(questType)} Points`}
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
                                    + {userData?.user.boostPercentage / 100}%
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
                                Join the Secured Finance points program!
                            </p>
                            {referralCode && (
                                <p className='mt-2 text-center text-secondary7'>
                                    Referral Code: {referralCode}
                                </p>
                            )}
                            <Button
                                className='mx-auto mt-4'
                                size={ButtonSizes.lg}
                                onClick={() => {
                                    const timestamp = new Date();
                                    setTimestamp(timestamp);
                                    const message = JSON.stringify({
                                        walletAddress: address,
                                        timestamp: timestamp.toISOString(),
                                    });
                                    signMessage({
                                        message: keccak256(
                                            stringToBytes(message)
                                        ),
                                    });
                                }}
                                disabled={!isConnected || isLoading || loading}
                            >
                                Join
                            </Button>
                        </>
                    )}
                </div>
            )}
        </GradientBox>
    );
};

const QuestList = () => {
    const [isOpenDepositModal, setIsOpenDepositModal] =
        useState<boolean>(false);
    const [isDefaultDepositCcySymbol, setIsDefaultDepositCcySymbol] = useState<
        string | undefined
    >(undefined);
    const { connectors } = useConnect();
    const chainId = useSelector((state: RootState) => state.blockchain.chainId);
    const { data, loading } = useGetQuestsQuery({
        pollInterval: POLL_INTERVAL,
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
        switch (questType) {
            case QuestType.Deposit:
                return (
                    <Button
                        size={ButtonSizes.md}
                        disabled={
                            startAt ? dayjs().isBefore(dayjs(startAt)) : false
                        }
                        onClick={() => {
                            if (questChainId && questCurrencies) {
                                if (questChainId !== chainId) {
                                    connector
                                        ?.switchChain?.(Number(questChainId))
                                        .then(() => {
                                            setTimeout(() => {
                                                setIsDefaultDepositCcySymbol(
                                                    questCurrencies[0]
                                                );
                                                setIsOpenDepositModal(true);
                                            }, 500);
                                        });
                                } else {
                                    setIsDefaultDepositCcySymbol(
                                        questCurrencies[0]
                                    );
                                    setIsOpenDepositModal(true);
                                }
                            }
                        }}
                    >
                        Deposit
                    </Button>
                );
            default:
                return <> </>;
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
                            <Chip
                                label={
                                    item.point.toString() +
                                    ([
                                        QuestType.DailyLogin,
                                        QuestType.Referral,
                                    ].includes(item.questType)
                                        ? 'pt'
                                        : 'pt / $')
                                }
                                color={
                                    item.isHighlight
                                        ? ChipColors.Yellow
                                        : ChipColors.Blue
                                }
                            />
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
                                    {`${formatDate(
                                        dayjs(item.startAt).unix()
                                    )} ~ ${formatDate(
                                        dayjs(item.endAt).unix()
                                    )}`}
                                </div>
                            )}
                        </div>
                        <div className='flex flex-row items-center justify-between text-sm text-grayScale'>
                            {item.description}
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
    const { data, loading } = useGetUsersQuery({
        variables: { page: 1, limit: 20 },
        pollInterval: POLL_INTERVAL,
    });

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
                            {ordinaryFormat(item.point, 0, 2, 'standard')}
                        </div>
                    </div>
                ))}
            </div>
        </GradientBox>
    );
};

export const PointsDashboard = () => {
    return (
        <Page title='Point Dashboard' name='point-dashboard'>
            <TwoColumns>
                <div className='grid grid-cols-1 gap-y-7'>
                    <UserPointInfo />
                    <QuestList />
                </div>
                <Leaderboard />
            </TwoColumns>
        </Page>
    );
};
