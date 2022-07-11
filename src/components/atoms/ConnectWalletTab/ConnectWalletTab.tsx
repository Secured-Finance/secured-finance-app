import SFLogo1 from 'src/assets/img/logo.svg';
import SFLogo from 'src/assets/img/sf-sphere.svg';
import { Button } from 'src/components/atoms';

export const ConnectWalletTab = () => {
    return (
        <div className='h-[444px] w-[350px]'>
            <div className='h-1 w-full bg-starBlue'></div>
            <div className='h-full w-full rounded-b-2xl border border-white-10 bg-gradient-to-b from-[rgba(106,118,177,0.1)] via-[rgba(106,118,177,0)] to-black-20 px-6'>
                <div className='flex h-full flex-col items-center gap-4 pt-5 pb-6'>
                    <SFLogo className='h-[188px] w-[210px]'></SFLogo>
                    <SFLogo1 className='h-[20px] w-[208px]'></SFLogo1>
                    <div className='typography-caption h-[92px] w-[230px] pb-5 text-center text-[#718096]'>
                        Welcome to the future of DeFi. Secured Finance brings
                        Interbank-grade lending solution to Web3.
                    </div>
                    <Button className='h-12' fullWidth={true}>
                        Connect Wallet to Get Started
                    </Button>
                </div>
            </div>
        </div>
    );
};
