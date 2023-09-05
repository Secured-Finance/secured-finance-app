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
                    <div className='flex w-full cursor-pointer items-center justify-between'>
                        <div className='flex items-center gap-10px'>
                            <div className='h-5 w-5'>{icon}</div>
                            <p className='typography-caption-2 leading-4 text-neutral-8'>
                                {text}
                            </p>
                        </div>
                        <span className='hidden group-hover:block'>
                            {badge}
                        </span>
                    </div>
                </a>
            </Link>
        </div>
    );
};
