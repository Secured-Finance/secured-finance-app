import { SVGProps } from 'react';

interface ChartIndexProps {
    asset?: string;
    value?: string;
    fluctuation?: string;
    IconSVG?: (props: SVGProps<SVGSVGElement>) => JSX.Element;
}

export const ChartIndex: React.FC<ChartIndexProps> = ({
    asset,
    value,
    fluctuation,
    IconSVG,
}) => {
    return (
        <div className='align-center flex h-44px w-36 flex-row justify-between gap-3 py-0.5 '>
            {IconSVG ? (
                <div>
                    <IconSVG className='h-10 w-10' />
                </div>
            ) : null}
            <div className='flex h-full w-full flex-col'>
                <span className='typography-caption-2 h-5 text-planetaryPurple'>
                    {asset}
                </span>
                <div className='flex h-5 w-full flex-row items-center justify-between'>
                    <span className='typography-caption flex h-full items-center text-neutral8'>
                        {value}
                    </span>
                    <span
                        className={`typography-caption flex h-full items-center ${
                            fluctuation.startsWith('+')
                                ? 'text-green'
                                : 'text-red'
                        }`}
                    >
                        {fluctuation}
                    </span>
                </div>
            </div>
        </div>
    );
};
