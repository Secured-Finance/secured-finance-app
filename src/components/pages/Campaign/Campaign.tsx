import { useGetUserLazyQuery } from '@secured-finance/sf-point-client';
import { useMemo, useState } from 'react';
import {
    DepositCollateral,
    generateCollateralList,
} from 'src/components/organisms';
import { useCollateralBalances } from 'src/hooks';
import { CurrencySymbol } from 'src/utils';
import { Banner, CampaignStatus, DepositCard, StageBanner } from './components';

const POLL_INTERVAL = 600000; // 10 minutes

export const Campaign = () => {
    const [openModal, setOpenModal] = useState(false);

    const collateralBalances = useCollateralBalances();
    const depositCollateralList = useMemo(
        () =>
            generateCollateralList(collateralBalances, false, [
                CurrencySymbol.iFIL,
            ]),
        [collateralBalances]
    );
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [getUser, { data: userData }] = useGetUserLazyQuery({
        pollInterval: POLL_INTERVAL,
    });

    return (
        <div className='flex flex-col gap-4 px-4 pt-[60px] laptop:gap-[72px] laptop:px-10'>
            <div className='flex justify-center'>
                <div className='flex w-fit flex-col items-center gap-4 laptop:gap-6'>
                    <Banner text={'STAGE 1: CORE FUELING & LAUNCH'}></Banner>
                    <div className='font-primary text-8 font-medium leading-11 text-white laptop:text-24 laptop:font-normal laptop:leading-[116px]'>
                        Filecoin Infinity Quest
                    </div>
                    <StageBanner></StageBanner>
                </div>
            </div>
            <div className='flex flex-col gap-4 laptop:flex-row laptop:justify-between'>
                <CampaignStatus
                    startTime={1718582400000}
                    endTime={1719532800000}
                    stage='Stage 1'
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
