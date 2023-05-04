export interface PortfolioTabProps {
    name: string;
    value: string;
}

export const PortfolioTab = ({ name, value }: PortfolioTabProps) => {
    return (
        <div
            className='flex h-28 w-full flex-col items-center justify-center'
            role='gridcell'
        >
            <div className='flex h-full w-full flex-col items-center justify-center overflow-hidden'>
                <span className='typography-caption-2 h-5 w-full text-center text-secondary7'>
                    {name}
                </span>
                <span
                    className='typography-body-1 h-8 w-full text-center text-white'
                    data-testid='portfolio-tab-value'
                >
                    {value}
                </span>
            </div>
        </div>
    );
};
