interface PercentageTabProps {
    percentage: number;
    active: boolean;
    onClick: () => void;
}

export const PercentageTab: React.FC<PercentageTabProps> = ({
    percentage,
    active,
    onClick,
}) => {
    return (
        <button
            className={`typography-percentage-tab flex h-10 w-16 flex-row items-center justify-center rounded-[90px] border-2 border-neutral-3 px-4 py-3 hover:border-none hover:bg-neutral-8 hover:text-neutral-2 ${
                active
                    ? 'border-none bg-neutral-8 text-neutral-2'
                    : 'text-neutral-4'
            }`}
            onClick={onClick}
            data-testid={percentage}
        >
            {percentage + '%'}
        </button>
    );
};
