import Link from 'next/link';
import { formatDataCy } from 'src/utils';

export const MenuItem = ({
    text,
    icon,
    badge,
    link,
}: {
    label?: string;
    text: string;
    icon: React.ReactNode;
    badge?: React.ReactNode;
    link: string;
}) => {
    return (
        <div
            data-cy={formatDataCy(text)}
            className='group relative flex w-full cursor-pointer rounded-md p-2 transition focus:outline-none'
        >
            <Link href={link} className='h-full w-full' passHref>
                <a href={link} className='h-full w-full' aria-label='Menu Item'>
                    <div className='group relative flex w-full cursor-pointer items-center'>
                        <div className='flex h-10 w-10 items-center justify-center'>
                            {icon}
                        </div>
                        <p className='typography-caption flex w-[90%] capitalize text-white'>
                            {text}
                        </p>
                        {badge && (
                            <span className='group relative my-3 flex h-full py-2 align-top'>
                                <span className='absolute top-0 right-0 -mt-5 transform opacity-0 transition-opacity group-hover:opacity-100'>
                                    <div className=' my-1 rounded-full py-1'>
                                        {badge}
                                    </div>
                                </span>
                            </span>
                        )}
                    </div>
                </a>
            </Link>
        </div>
    );
};
