import Fail from 'src/assets/icons/failed.svg';

export const FailurePanel = ({ errorMessage }: { errorMessage: string }) => {
    return (
        <div className='flex w-full flex-col items-center gap-6'>
            <Fail className='h-[100px] w-[100px]' />
            <div className='flex h-fit w-full flex-col gap-2 rounded-xl border border-neutral-3 bg-black-20 pl-6 pt-4 pb-7 pr-2'>
                <div className='flex flex-row items-center justify-between pr-2'>
                    <div className='typography-caption-2 text-slateGray'>
                        Error Details
                    </div>
                    <button
                        className='typography-dropdown-selection-label flex h-7 w-14 items-center justify-center rounded-[10px] bg-black font-semibold text-white'
                        onClick={() => {
                            navigator.clipboard.writeText(errorMessage);
                        }}
                    >
                        Copy
                    </button>
                </div>
                <div className='typography-caption-2 scrollbar-error h-fit max-h-20 overflow-y-auto overflow-x-hidden font-medium text-[#A0AEC0]'>
                    {errorMessage}
                </div>
            </div>
        </div>
    );
};
