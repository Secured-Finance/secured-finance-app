import { ArrowUpRightIcon } from '@heroicons/react/24/outline';
import clsx from 'clsx';
import Check from 'src/assets/icons/check-mark.svg';
import { SectionWithItems } from 'src/components/atoms';
import { Tooltip } from 'src/components/templates';

export const SuccessPanel = ({
    itemList,
    txHash,
    blockExplorerUrl,
}: {
    itemList: [string, string][];
    txHash?: string;
    blockExplorerUrl?: string;
}) => {
    const blockExplorerLink = blockExplorerUrl
        ? `${blockExplorerUrl}/tx/${txHash}`
        : '';

    const handleButtonClick = () => {
        window.open(blockExplorerLink, '_blank');
    };

    const items: [React.ReactNode, React.ReactNode][] = [];

    itemList.forEach(([key, value], index) => {
        let newItem: [React.ReactNode, React.ReactNode];
        if (index === 1 && txHash) {
            newItem = [
                <KeyComponent value={key} key={key} />,
                <EtherScanTooltip
                    value={value}
                    handleClick={handleButtonClick}
                    key={index}
                />,
            ];
        } else {
            newItem = [
                <KeyComponent value={key} key={key} />,
                <ValueComponent value={value} index={index} key={index} />,
            ];
        }
        items.push(newItem);
    });

    return (
        <div className='grid w-full grid-cols-1 items-center justify-center gap-6'>
            <div className='flex items-center justify-center'>
                <Check className='h-[100px] w-[100px]' />
            </div>
            <SectionWithItems itemList={items} />
        </div>
    );
};

const ValueComponent = ({ value, index }: { value: string; index: number }) => (
    <span
        className={clsx('typography-caption whitespace-nowrap leading-6', {
            'text-[#58BD7D]': index === 0,
            'text-neutral-8': index !== 0,
        })}
    >
        {value}
    </span>
);

const KeyComponent = ({ value }: { value: string }) => (
    <span className='typography-caption  whitespace-nowrap text-neutral-4'>
        {value}
    </span>
);

const EtherScanTooltip = ({
    value,
    handleClick,
}: {
    value: string;
    handleClick: () => void;
}) => (
    <Tooltip
        iconElement={
            <button
                className='secondary typography-caption cursor-pointer whitespace-nowrap text-planetaryPurple underline'
                onClick={handleClick}
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
);
