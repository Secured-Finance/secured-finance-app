import { useState } from 'react';
import SFLogo from 'src/assets/img/logo.svg';
import SFSphere from 'src/assets/img/sf-sphere.png';
import { Button, GradientBox } from 'src/components/atoms';
import { WalletDialog } from 'src/components/organisms';

export const ConnectWalletCard = () => {
    const [display, setDisplay] = useState(false);

    return (
        <div className='h-fit w-full'>
            <GradientBox>
                <div className='flex h-full flex-col items-center gap-4 px-6 pt-5 pb-6'>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                        src={SFSphere.src}
                        className='h-[188px] w-[210px]'
                        alt='SF Logo'
                    ></img>
                    <SFLogo className='h-5 w-[208px]'></SFLogo>
                    <div className='typography-caption h-[92px] w-[230px] pb-5 text-center text-[#718096]'>
                        Welcome to the future of DeFi. Secured Finance brings
                        Interbank-grade lending solution to Web3.
                    </div>
                    <Button
                        className='h-12'
                        fullWidth={true}
                        onClick={() => setDisplay(true)}
                    >
                        Connect Wallet to Get Started
                    </Button>
                </div>
            </GradientBox>
            <WalletDialog
                isOpen={display}
                onClose={() => setDisplay(false)}
            ></WalletDialog>
        </div>
    );
};
