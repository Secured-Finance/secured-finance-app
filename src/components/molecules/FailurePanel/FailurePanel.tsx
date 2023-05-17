import { useState } from 'react';
import Fail from 'src/assets/icons/failed.svg';

export const FailurePanel = ({ errorMessage }: { errorMessage: string }) => {
    const [buttonText, setButtonText] = useState('Copy');
    return (
        <div className='flex w-full flex-col items-center gap-6'>
            <Fail className='h-[100px] w-[100px]' />
            <div className='flex h-fit w-full flex-col gap-2 rounded-xl border border-neutral-3 bg-black-20 pb-7 pl-6 pr-2 pt-4'>
                <div className='flex flex-row items-center justify-between pr-2'>
                    <div className='typography-caption-2 text-slateGray'>
                        Error Details
                    </div>
                    <button
                        className='typography-dropdown-selection-label flex h-7 w-fit items-center rounded-[10px] bg-black px-[10px] font-semibold text-white'
                        onClick={() => {
                            navigator.clipboard.writeText(errorMessage);
                            setButtonText('Copied!');
                        }}
                    >
                        {buttonText}
                    </button>
                </div>
                <div className='typography-caption-2 scrollbar-error h-fit max-h-20 overflow-y-auto overflow-x-hidden break-words pr-2 font-medium text-[#A0AEC0]'>
                    {errorMessage}
                </div>
            </div>
        </div>
    );
};
