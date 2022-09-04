export const Chip = ({ label }: { label: string }) => {
    return (
        <div className='flex h-6 w-16 items-center justify-center rounded bg-starBlue'>
            <span className='typography-pill-label py-1 px-2 text-center text-neutral-8'>
                {label}
            </span>
        </div>
    );
};
