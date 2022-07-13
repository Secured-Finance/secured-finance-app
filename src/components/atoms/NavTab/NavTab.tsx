interface NavTabProps {
    text: string;
    active: boolean;
    onClick?: () => void;
}

export const NavTab: React.FC<NavTabProps> = ({
    text,
    active = false,
    onClick,
}) => {
    return (
        <div className='flex h-20 w-full flex-grow-0 flex-col items-center p-0 text-center'>
            <div className={`h-1 w-full ${active ? 'bg-starBlue' : ''}`}></div>
            <div
                className={`w-full flex-1 items-center justify-center px-8 pt-6 ${
                    active
                        ? 'bg-gradient-to-b from-tabGradient2 to-tabGradient1'
                        : ''
                }`}
            >
                <button
                    className='typography-nav-menu-default h-4 text-neutral8'
                    onClick={onClick}
                    data-testid={`${text}-tab-button`}
                >
                    {text}
                </button>
            </div>
        </div>
    );
};
