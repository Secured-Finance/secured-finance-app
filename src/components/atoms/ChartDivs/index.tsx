interface ChartDivsProps {
    header?: string;
    footer?: string;
}

export const ChartDivs: React.FC<ChartDivsProps> = ({ header, footer }) => {
    return (
        <div className='flex h-44px w-42 flex-col p-0 text-center'>
            <div className='typography-caption-2 items h-5 text-planetaryPurple'>
                {header}
            </div>
            <div className='typography-caption h-6 text-white-60'>{footer}</div>
        </div>
    );
};
