interface NavTabProps {
    text: string;
    active: boolean;
    onClick?: () => void;
    as?: 'button' | 'div';
}

export const NavTab = ({
    text,
    active = false,
    onClick,
    as = 'button',
}: NavTabProps) => {
    return (
        <div className='flex h-full w-full flex-col p-0 text-center'>
            <div className={`h-1 w-full ${active ? 'bg-starBlue' : ''}`}></div>
            <div
                className={`flex h-full items-center justify-center px-8 ${
                    active
                        ? 'bg-gradient-to-b from-tabGradient2 to-tabGradient1'
                        : ''
                }`}
            >
                {as === 'button' ? (
                    <button
                        className='typography-nav-menu-default h-4 text-neutral-8'
                        onClick={onClick}
                        data-testid={`${text}-tab-button`}
                    >
                        {text}
                    </button>
                ) : (
                    <div
                        className='typography-nav-menu-default h-4 text-neutral-8'
                        data-testid={`${text}-tab`}
                    >
                        {text}
                    </div>
                )}
            </div>
        </div>
    );
};
