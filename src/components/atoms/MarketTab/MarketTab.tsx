import clsx from 'clsx';
import ArrowUpSquare from 'src/assets/icons/arrow-up-square.svg';
import { ordinaryFormat } from 'src/utils';

export interface MarketTabProps {
    name: string;
    value: string | number;
    source?: string;
    variant?: 'default' | 'green-name' | 'gray-name';
    label?: string;
}

export const MarketTab = ({
    name,
    value,
    source,
    variant = 'default',
    label,
}: MarketTabProps) => {
    return (
        <section
            className={clsx('flex h-fit flex-grow flex-col', {
                'gap-1': variant === 'default',
            })}
            aria-label={label ?? name}
        >
            <span
                className={clsx({
                    'typography-button-3 whitespace-nowrap leading-8 text-nebulaTeal':
                        variant === 'green-name',
                    'typography-button-3 whitespace-nowrap leading-8 text-slateGray':
                        variant === 'gray-name',
                    'whitespace-nowrap text-[0.6875rem] leading-4 text-slateGray':
                        variant === 'default',
                })}
            >
                {name}
            </span>
            <span
                className={clsx(
                    {
                        'typography-caption whitespace-nowrap text-white':
                            variant === 'green-name',
                        'typography-caption whitespace-nowrap text-slateGray':
                            variant === 'gray-name',
                        'text-xs font-semibold leading-5 text-neutral-8':
                            variant === 'default',
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
        </section>
    );
};
