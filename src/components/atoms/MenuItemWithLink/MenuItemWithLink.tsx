import Link from 'next/link';
import { MenuItem } from 'src/components/atoms';
import { formatDataCy } from 'src/utils';

export const MenuItemWithLink = ({
    text,
    icon,
    link,
    badge,
}: {
    text: string;
    link: string;
    icon?: React.ReactNode;
    badge?: React.ReactNode;
}) => {
    return (
        <div
            data-cy={formatDataCy(text)}
            className='group flex w-full cursor-pointer items-center rounded-md p-2 hover:bg-horizonBlue focus:outline-none'
        >
            <Link href={link} className='flex h-full w-full' passHref>
                <a
                    href={link}
                    className='h-full w-full'
                    aria-label='Menu Item'
                    target='_blank'
                    rel='noopener noreferrer'
                >
                    <MenuItem text={text} icon={icon} badge={badge} />
                </a>
            </Link>
        </div>
    );
};
