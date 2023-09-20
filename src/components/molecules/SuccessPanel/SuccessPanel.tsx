import { ArrowUpRightIcon } from '@heroicons/react/24/outline';
import classNames from 'classnames';
import Check from 'src/assets/icons/check-mark.svg';
import { Tooltip } from 'src/components/templates';

export const SuccessPanel = ({
    itemList,
    txHash,
    etherscanUrl,
}: {
    itemList: [string, string][];
    txHash?: string;
    etherscanUrl?: string;
}) => {
    const etherscanLink = etherscanUrl ? `${etherscanUrl}/tx/${txHash}` : '';

    const handleButtonClick = () => {
        window.open(etherscanLink, '_blank');
    };

    return (
        <div className='flex w-full flex-col items-center gap-6'>
            <Check className='h-[100px] w-[100px]' />
            <div className='flex h-28 w-full flex-row gap-6 rounded-xl border border-neutral-3 p-6'>
                {itemList.map(([key, value], index) => (
                    <div
                        key={`${key}-${index}`}
                        className='typography-caption flex flex-col gap-10px'
                    >
                        <span className='text-neutral-4'>{key}</span>
                        {index === 1 && txHash ? (
                            <Tooltip
                                iconElement={
                                    <button
                                        className='secondary cursor-pointer whitespace-nowrap text-planetaryPurple underline'
                                        onClick={handleButtonClick}
                                    >
                                        {value}
                                    </button>
                                }
                            >
                                <div className='typography flex items-center justify-between gap-1 text-white'>
                                    <p>View on Etherscan</p>
                                    <ArrowUpRightIcon className='h-3 w-3' />
                                </div>
                            </Tooltip>
                        ) : (
                            <span
                                className={classNames(' leading-6', {
                                    'text-[#58BD7D]': index === 0,
                                    'text-neutral-8': index !== 0,
                                })}
                            >
                                {value}
                            </span>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};
