import { useCallback, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
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
        <div className='campaign'>
            <div className='container mx-auto flex flex-col gap-3 px-6 pb-8 pt-6  tablet:gap-7 laptop:gap-14 laptop:pb-[80px] laptop:pt-10'>
                <div className='flex justify-center'>
                    <div className='flex w-full flex-col items-center gap-3 laptop:gap-4 desktop:gap-6'>
                        <Banner text='STAGE 1: CORE FUELING & LAUNCH'></Banner>
                        <div className='text-center font-primary text-7 font-medium leading-8 text-white tablet:text-11 tablet:leading-16 laptop:text-16 laptop:font-normal laptop:leading-18 desktop:text-[80px] desktop:leading-[96px]'>
                            Filecoin Infinity Quest
                        </div>
                        <StageBanner />
                    </div>
                </div>
                <div className='flex flex-col-reverse gap-4 tablet:gap-[28px] laptop:flex-row laptop:justify-between'>
                    <CampaignStatus
                        startTime={1718755200000}
                        endTime={1719532800000}
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
                    source='Campaign Page'
                    defaultCcySymbol={CurrencySymbol.iFIL}
                />
            </div>
        </div>
    );
};
