import { useGetUserLazyQuery } from '@secured-finance/sf-point-client';
import { useMemo, useState } from 'react';
import CampaignSeparator from 'src/assets/icons/campaign-separator.svg';
import {
    DepositCollateral,
    generateCollateralList,
} from 'src/components/organisms';
import {
    emptyCollateralBook,
    useCollateralBalances,
    useCollateralBook,
    useCollateralCurrencies,
} from 'src/hooks';
import { CurrencySymbol, currencyMap } from 'src/utils';
import { useAccount } from 'wagmi';
import { Banner, CampaignStatus, DepositCard, StageBanner } from './components';

const POLL_INTERVAL = 600000; // 10 minutes

export const Campaign = () => {
    const [openModal, setOpenModal] = useState(false);
    const { address } = useAccount();

    const collateralBalances = useCollateralBalances();
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { data: collateralBook = emptyCollateralBook } =
        useCollateralBook(address);
    const { data: collateralCurrencies = [] } = useCollateralCurrencies();

    const depositCollateralList = useMemo(
        () =>
            generateCollateralList(
                collateralBalances,
                false,
                collateralCurrencies.filter(
                    ccy => currencyMap[ccy].coinGeckoId === 'filecoin'
                )
            ),
        [collateralBalances, collateralCurrencies]
    );
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [getUser, { data: userData }] = useGetUserLazyQuery({
        pollInterval: POLL_INTERVAL,
    });

    return (
        <div className='flex flex-col gap-4 px-6 pt-[60px] laptop:gap-9 laptop:px-10'>
            <div className='flex justify-center'>
                <div className='flex w-fit flex-col items-center gap-4 laptop:gap-6'>
                    <Banner text='STAGE 1: CORE FUELING & LAUNCH'></Banner>
                    <div className='font-primary text-8 font-medium leading-11 text-white laptop:text-24 laptop:font-normal laptop:leading-[116px]'>
                        Filecoin Infinity Quest
                    </div>
                    <StageBanner />
                    <CampaignSeparator className='h-2px w-full laptop:hidden' />
                </div>
            </div>
            <div className='flex flex-col gap-4 laptop:flex-row laptop:justify-between'>
                <CampaignStatus
                    startTime={1718582400000}
                    endTime={1719532800000}
                    stage='Stage 1'
                    filValue={1}
                    iFilValue={1}
                    totalUSDValue={2}
                />
                <DepositCard
                    onDepositClick={() => setOpenModal(true)}
                    onShareClick={() =>
                        navigator.clipboard.writeText(
                            `${
                                window.location.origin +
                                window.location.pathname
                            }?ref=${userData?.user.referralCode || ''}`
                        )
                    }
                />
            </div>
            <DepositCollateral
                isOpen={openModal}
                onClose={() => setOpenModal(false)}
                collateralList={depositCollateralList}
                source='Collateral Tab'
                defaultCcySymbol={CurrencySymbol.iFIL}
            ></DepositCollateral>
        </div>
    );
};
