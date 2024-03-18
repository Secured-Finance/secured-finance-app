import clsx from 'clsx';
import { SubTabProps } from './types';

export const SubTab = ({ text, active }: SubTabProps) => {
    return (
        <span
            className={clsx(
                'group flex h-full w-full items-center justify-center rounded-md px-[0.3675rem] py-[0.375rem] text-xs font-semibold leading-4 duration-300 hover:opacity-100 hover:ease-in-out laptop:px-3 laptop:leading-5',
                {
                    'bg-primary-500 text-neutral-50': active,
                    'bg-transparent text-neutral-400 light:text-neutral-600':
                        !active,
                }
            )}
        >
            {text}
        </span>
    );
};
