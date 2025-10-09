import ArrowUpSquare from 'src/assets/icons/arrow-up-square.svg';
import { FORMAT_DIGITS, PriceFormatter } from 'src/utils';

export interface MarketTabProps {
    name: string;
    value: number | React.ReactNode;
    source?: string;
    label?: string;
}

export const MarketTab = ({ name, value, source, label }: MarketTabProps) => {
    return (
        <section
            className='flex h-fit flex-grow flex-col'
            aria-label={label ?? name}
        >
            <span className='laptop:typography-caption-2 whitespace-nowrap text-[11px] text-neutral-400'>
                {name}
            </span>
            <span className='typography-caption flex items-center whitespace-nowrap leading-4 text-neutral-50 desktop:leading-6'>
                {typeof value === 'number'
                    ? PriceFormatter.formatOrdinary(
                          value,
                          FORMAT_DIGITS.ZERO,
                          FORMAT_DIGITS.AMOUNT
                      )
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
