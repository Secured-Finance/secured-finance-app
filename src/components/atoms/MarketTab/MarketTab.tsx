import classNames from 'classnames';
import ArrowUpSquare from 'src/assets/icons/arrow-up-square.svg';
import { ordinaryFormat } from 'src/utils';

export interface MarketTabProps {
    name: string;
    value: string | number;
    source?: string;
    variant?: 'default' | 'green-name';
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
            className={classNames('flex h-fit flex-grow flex-col', {
                'gap-1': variant === 'default',
            })}
            aria-label={label ?? name}
        >
            <span
                className={classNames({
                    'typography-button-3 whitespace-nowrap leading-7 text-nebulaTeal':
                        variant === 'green-name',
                    'typography-caption-2 whitespace-nowrap text-slateGray':
                        variant === 'default',
                })}
            >
                {name}
            </span>
            <span
                className={classNames(
                    {
                        'typography-caption whitespace-nowrap text-white':
                            variant === 'green-name',
                        'typography-caption text-neutral-8':
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
