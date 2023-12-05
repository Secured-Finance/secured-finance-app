export const MenuItem = ({
    text,
    icon,
    badge,
}: {
    text: string;
    icon?: React.ReactNode;
    badge?: React.ReactNode;
}) => (
    <div className='flex w-full cursor-pointer items-center justify-between'>
        <div className='flex items-center gap-10px'>
            {icon && <div className='h-5 w-5'>{icon}</div>}
            <p className='typography-caption-2 leading-4 text-neutral-8'>
                {text}
            </p>
        </div>
        {badge && <span className='hidden group-hover:block'>{badge}</span>}
    </div>
);
