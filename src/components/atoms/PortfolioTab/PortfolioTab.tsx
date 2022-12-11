export interface PortfolioTabProps {
    name: string;
    value: string;
    orientation: 'left' | 'right' | 'center';
}

export const PortfolioTab = ({
    name,
    value,
    orientation,
}: PortfolioTabProps) => {
    return (
        <div className='flex h-28 w-full flex-col items-center justify-center'>
            <div className='h-1 w-full bg-starBlue'></div>
            <div
                className={`flex h-full w-full flex-col items-center justify-center overflow-hidden bg-gradient-to-b from-[rgba(106,118,177,0.1)] via-[rgba(106,118,177,0)] to-black-20 ${
                    orientation ? getBorderStyle(orientation) : ''
                }`}
            >
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

const getBorderStyle = (orientation: 'left' | 'right' | 'center') => {
    switch (orientation) {
        case 'left':
            return 'border-l border-r-0.5 border-b rounded-bl-2xl border-white-10';
        case 'right':
            return 'border-l-0.5 border-r border-b border-white-10 rounded-br-2xl';
        case 'center':
            return 'border-x-0.5 border-b border-white-10';
    }
};
