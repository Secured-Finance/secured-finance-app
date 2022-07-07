interface TraderProTabProps {
    text: string;
    onClick?: () => void;
}

export const TraderProTab: React.FC<TraderProTabProps> = ({
    text,
    onClick,
}) => {
    return (
        <div className='flex h-20 w-max flex-grow-0 flex-row items-center justify-center gap-[10px] px-[30px]'>
            <div className='typography-nav-menu-default h-4 text-center text-secondary7'>
                {text}
            </div>
            <button
                className='typography-pill-label h-4 w-[56px] rounded-3xl bg-primary7 text-universeBlue'
                onClick={onClick}
            >
                SIGN UP
            </button>
        </div>
    );
};
