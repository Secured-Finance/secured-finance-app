import { LendingCard } from 'src/components/organisms';

export const Landing = () => {
    return (
        <div className='flex-col items-center space-y-24 py-24'>
            <div className='flex flex-col items-center justify-center space-y-8 text-center'>
                <h1 className='typography-headline-1 text-white'>
                    Interbank-grade Lending <br />
                    Now Democratized
                </h1>
                <h2 className='typography-body-2 w-1/3 text-white-80'>
                    An elegant open-market digital asset lending solution
                    offering interoperability with traditional banking and
                    decentralization via Web3
                </h2>
            </div>
            <div className='flex flex-row justify-center space-x-8'>
                <LendingCard />
                <div className='w-5/12 bg-gunMetal text-white'>PLAHOLDER</div>
            </div>
        </div>
    );
};
