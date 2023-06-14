import classNames from 'classnames';
import ArrowUpSquare from 'src/assets/icons/arrow-up-square.svg';
import { ordinaryFormat } from 'src/utils';

export interface MarketTabProps {
    name: string | number;
    value: string | number;
    source?: string;
}

export const MarketTab = ({ name, value, source }: MarketTabProps) => {
    return (
        <div
            className={`flex h-fit flex-grow flex-col ${
                typeof name === 'string' ? 'gap-1' : ''
            }`}
        >
            <span
                className={classNames({
                    'typography-button-3 whitespace-nowrap leading-7 text-nebulaTeal':
                        typeof name === 'number',
                    'typography-caption-2 whitespace-nowrap text-slateGray':
                        typeof name === 'string',
                })}
            >
                {typeof name === 'number' ? name.toFixed(2) : name}
            </span>
            <span
                className={classNames(
                    {
                        'typography-caption font-medium text-neutral-8':
                            typeof value === 'number',
                        'typography-caption-2 whitespace-nowrap font-semibold text-white':
                            typeof value === 'string',
                    },
                    'flex items-center'
                )}
            >
                {typeof value === 'number'
                    ? ordinaryFormat(value, 0, 4)
                    : value}
                {source && (
                    <a
                        href={source}
                        className='h-full w-full cursor-pointer'
                        target='_blank'
                        rel='noopener noreferrer'
                    >
                        <ArrowUpSquare className='mx-2 h-3 w-3' />
                    </a>
                )}
            </span>
        </div>
    );
};
