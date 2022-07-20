/* eslint-disable @next/next/no-img-element */
import { useState } from 'react';
import SFLogo from 'src/assets/img/logo.svg';
import SFSphere from 'src/assets/img/sf-sphere.png';
import { Button } from 'src/components/atoms';
import { WalletDialog } from 'src/components/organisms';

export const ConnectWalletCard = () => {
    const [display, setDisplay] = useState(false);

    return (
        <div className='h-fit w-[350px]'>
            <div className='h-1 w-full bg-starBlue'></div>
            <div className='h-full w-full rounded-b-2xl border border-white-10 bg-gradient-to-b from-[rgba(106,118,177,0.1)] via-[rgba(106,118,177,0)] to-black-20 px-6'>
                <div className='flex h-full flex-col items-center gap-4 pt-5 pb-6'>
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
            </div>
            <WalletDialog
                isOpen={display}
                onClose={() => setDisplay(false)}
            ></WalletDialog>
        </div>
    );
};
