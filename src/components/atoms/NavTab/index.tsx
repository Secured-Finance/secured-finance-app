interface NavTabProps {
    text?: string;
    active?: boolean;
}

export const NavTab: React.FC<NavTabProps> = ({ text, active }) => {
    return (
        <div className='flex h-20 w-max flex-grow-0 flex-col items-center p-0'>
            <div className={`h-1 w-full ${active ? 'bg-starBlue' : ''}`}></div>
            <div
                className={`w-full flex-1 items-center justify-center px-8 pt-7 ${
                    active ? 'bg-gradient-to-b from-lg_2 to-lg_1' : ''
                }`}
            >
                <span className='typography-nav-tab h-4 items-center text-center text-neutral8'>
                    {text}
                </span>
            </div>
        </div>
    );
};
