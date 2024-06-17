import { useCallback, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import CampaignSeparator from 'src/assets/icons/campaign-separator.svg';
import {
    DepositCollateral,
    generateCollateralList,
} from 'src/components/organisms';
import {
    emptyCollateralBook,
    useCollateralBalances,
    useCollateralBook,
    useLastPrices,
} from 'src/hooks';
import { RootState } from 'src/store/types';
import { CurrencySymbol, readWalletFromStore } from 'src/utils';
import { isProdEnv } from 'src/utils/displayUtils';
import { useAccount, useConnect } from 'wagmi';
import { Banner, CampaignStatus, DepositCard, StageBanner } from './components';

const prodQuestChainId = 314;
const devQuestChainId = 314159;

const DEV_COLLATERAL_CURRENCIES = [CurrencySymbol.tFIL, CurrencySymbol.iFIL];
const PROD_COLLATERAL_CURRENCIES = [CurrencySymbol.FIL, CurrencySymbol.iFIL];

export const Campaign = () => {
    const [openModal, setOpenModal] = useState(false);
    const { address } = useAccount();

    const { connectors } = useConnect();
    const provider = readWalletFromStore();
    const chainId = useSelector((state: RootState) => state.blockchain.chainId);
    const connector = connectors.find(connect => connect.name === provider);

    const collateralBalances = useCollateralBalances();
    const { data: priceList } = useLastPrices();
    const { data: collateralBook = emptyCollateralBook } =
        useCollateralBook(address);

    const collateralCurrencies = isProdEnv()
        ? PROD_COLLATERAL_CURRENCIES
        : DEV_COLLATERAL_CURRENCIES;

    const questChainId = isProdEnv() ? prodQuestChainId : devQuestChainId;

    const depositCollateralList = useMemo(
        () =>
            generateCollateralList(
                collateralBalances,
                false,
                collateralCurrencies
            ),
        [collateralBalances, collateralCurrencies]
    );

    const handleDepositClick = useCallback(() => {
        if (questChainId !== chainId) {
            connector?.switchChain?.(Number(questChainId)).then(() => {
                setTimeout(() => {
                    setOpenModal(true);
                }, 500);
            });
        } else {
            setOpenModal(true);
        }
    }, [chainId, connector, questChainId]);

    return (
        <div className='campaign flex flex-col gap-4 px-6 pt-[60px] laptop:gap-9 laptop:px-10'>
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
                    startTime={1718755200000}
                    endTime={1719532800000}
                    stage='Stage 1'
                    collateralCurrencies={collateralCurrencies}
                    collateral={collateralBook.collateral}
                    priceList={priceList}
                />
                <DepositCard onDepositClick={handleDepositClick} />
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
