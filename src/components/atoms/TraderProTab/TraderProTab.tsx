interface TraderProTabProps {
    text: string;
    onClick?: () => void;
}

export const TraderProTab: React.FC<TraderProTabProps> = ({ text }) => {
    return (
        <div className='flex h-20 w-max flex-grow-0 flex-row items-center justify-center px-[30px]'>
            <div className='typography-nav-menu-default h-4 text-center text-neutral8'>
                {text}
            </div>
        </div>
    );
};
