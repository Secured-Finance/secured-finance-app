import { Badge as BaseBadge } from '@mui/base/Badge';

export const Badge = ({
    children,
    badgeCount,
}: {
    children: JSX.Element;
    badgeCount: number;
}) => {
    return (
        <div className='relative inline-block'>
            <BaseBadge
                badgeContent={badgeCount}
                className='typography-caption-2 absolute -right-[10px] -top-[10px] flex h-[14px] w-4 items-center justify-center rounded-xl bg-nebulaTeal px-1 text-black'
            ></BaseBadge>
            {children}
        </div>
    );
};
