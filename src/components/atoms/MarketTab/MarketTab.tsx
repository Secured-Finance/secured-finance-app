import clsx from 'clsx';
import ArrowUpSquare from 'src/assets/icons/arrow-up-square.svg';
import { ordinaryFormat } from 'src/utils';

export interface MarketTabProps {
    name: string;
    value?: number | React.ReactNode;
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
                'gap-[1.5px]': variant === 'green-name',
            })}
            aria-label={label ?? name}
        >
            <span
                className={clsx({
                    'whitespace-nowrap text-base font-semibold leading-[1.57] text-nebulaTeal laptop:text-smd':
                        variant === 'green-name',
                    'typography-button-3 whitespace-nowrap leading-8 text-slateGray':
                        variant === 'gray-name',
                    'laptop:typography-caption-2 whitespace-nowrap text-[11px] text-neutral-400':
                        variant === 'default',
                })}
            >
                {name}
            </span>
            <span
                className={clsx(
                    {
                        'laptop:typography-caption whitespace-nowrap text-[11px] text-white':
                            variant === 'green-name',
                        'typography-caption whitespace-nowrap text-slateGray':
                            variant === 'gray-name',
                        'typography-caption leading-4 text-neutral-50 desktop:leading-6':
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
