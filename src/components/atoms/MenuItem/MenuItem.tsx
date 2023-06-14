import Link from 'next/link';
import { formatDataCy } from 'src/utils';

export const MenuItem = ({
    text,
    icon,
    link,
    badge,
}: {
    text: string;
    icon: React.ReactNode;
    link: string;
    badge: React.ReactNode;
}) => {
    return (
        <div
            data-cy={formatDataCy(text)}
            className='group relative flex w-full cursor-pointer items-center rounded-md p-2 opacity-100 transition hover:bg-horizonBlue focus:outline-none'
        >
            <Link
                href={link}
                className='align-center flex h-full w-full '
                passHref
            >
                <a
                    href={link}
                    className='group h-full w-full'
                    aria-label='Menu Item'
                    target='_blank'
                    rel='noopener noreferrer'
                >
                    <div className='relative flex w-full cursor-pointer items-center'>
                        <div className='flex h-10 w-10 items-center justify-center'>
                            {icon}
                        </div>
                        <div className='flex w-full items-center justify-between'>
                            <p className='typography-caption flex w-[90%] text-white'>
                                {text}
                            </p>
                            {badge && (
                                <span className='absolute right-0 my-1 h-full align-top opacity-0 group-hover:opacity-100'>
                                    {badge}
                                </span>
                            )}
                        </div>
                    </div>
                </a>
            </Link>
        </div>
    );
};
