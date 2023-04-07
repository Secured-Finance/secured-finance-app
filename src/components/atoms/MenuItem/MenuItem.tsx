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
            data-testid='menu-item'
        >
            <Link href={link} className='h-full' aria-label='Menu Item'>
                <div className='group relative flex w-full cursor-pointer items-center'>
                    <div className='flex h-10 w-10 items-center justify-center'>
                        {icon}
                    </div>
                    <p className='typography-caption flex w-[80%] capitalize text-white'>
                        {text}
                    </p>
                    {badge && (
                        <span className='group relative my-3 flex h-full py-2 align-top'>
                            <span className='absolute top-0 right-0 -mt-2 -mr-2 translate-x-1/2 transform opacity-0 transition-opacity duration-150 group-hover:opacity-100'>
                                <div
                                    data-testid='badge'
                                    className='bg-blue-500 my-1 rounded-full py-1 font-bold text-white'
                                >
                                    {badge}
                                </div>
                            </span>
                        </span>
                    )}
                </div>
            </Link>
        </div>
    );
};
