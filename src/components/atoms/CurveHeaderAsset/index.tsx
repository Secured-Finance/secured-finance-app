interface CurveHeaderAssetProps {
    asset: string;
    value: string;
    fluctuation: string;
    IconSVG: React.FunctionComponent<React.SVGProps<SVGSVGElement>>;
}

export const CurveHeaderAsset: React.FC<CurveHeaderAssetProps> = ({
    asset,
    value,
    fluctuation,
    IconSVG,
}) => {
    return (
        <div className='flex h-44 w-36 flex-row justify-between gap-3 py-0.5 '>
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
