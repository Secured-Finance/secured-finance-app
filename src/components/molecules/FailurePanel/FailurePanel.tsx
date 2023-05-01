import Fail from 'src/assets/icons/failed.svg';

export const FailurePanel = ({ errorMessage }: { errorMessage: string }) => {
    return (
        <div className='flex w-full flex-col items-center gap-6'>
            <Fail className='h-[100px] w-[100px]' />
            <div className='flex h-20 w-full items-center rounded-xl border border-neutral-3 bg-black-20 px-6'>
                <div className='horizontal-scrollbar typography-caption-2 flex h-14 items-center overflow-x-auto overflow-y-hidden whitespace-nowrap font-medium text-[#A0AEC0]'>
                    {errorMessage}
                </div>
            </div>
        </div>
    );
};
