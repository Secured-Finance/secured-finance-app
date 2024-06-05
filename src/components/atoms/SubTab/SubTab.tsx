import clsx from 'clsx';
import { SubTabProps } from './types';

export const SubTab = ({ text, active }: SubTabProps) => {
    return (
        <span
            className={clsx(
                'group flex h-full w-full items-center justify-center rounded-md px-[5.88px] py-1.5 text-xs font-semibold leading-4 duration-300 hover:opacity-100 hover:ease-in-out laptop:px-3 laptop:leading-5',
                {
                    'bg-primary-700 text-neutral-50': active,
                    'text-neutral-400': !active,
                }
            )}
        >
            {text}
        </span>
    );
};
