interface NavTabProps {
    text: string;
    active: boolean;
}

export const NavTab = ({ text, active = false }: NavTabProps) => {
    return (
        <div className='group flex h-full w-full flex-col p-0 text-center'>
            <div className={`h-1 w-full ${active ? 'bg-starBlue' : ''}`}></div>
            <div
                className={`flex h-full items-center justify-center px-8 ${
                    active
                        ? 'bg-gradient-to-b from-tabGradient2 to-tabGradient1'
                        : ''
                }`}
            >
                <div
                    className={`typography-nav-menu-default h-4 text-neutral-8 ${
                        active ? 'opacity-100' : 'opacity-70'
                    } duration-300 group-hover:opacity-100 group-hover:ease-in-out`}
                    data-testid={`${text}-tab`}
                >
                    {text}
                </div>
            </div>
        </div>
    );
};
