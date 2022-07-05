interface CurveHeaderTotalProps {
    header: string;
    footer: string;
}

export const CurveHeaderTotal: React.FC<CurveHeaderTotalProps> = ({
    header,
    footer,
}) => {
    return (
        <div className='flex h-[44px] w-[135px] flex-col p-0 text-center'>
            <div className='typography-caption-2 h-5 text-planetaryPurple'>
                {header}
            </div>
            <div className='typography-caption h-6 text-white-60'>{footer}</div>
        </div>
    );
};
