import clsx from 'clsx';
import { SubTabProps } from './types';

export const SubTab = ({ text, active }: SubTabProps) => {
    return (
        <span
            className={clsx(
                'laptop:typography-desktop-body-5 group flex h-full w-full items-center justify-center rounded-md px-[5.88px] py-1.5 text-xs font-semibold leading-4 laptop:px-3',
                {
                    'bg-primary-700 text-neutral-50': active,
                    'text-neutral-400': !active,
                },
            )}
        >
            {text}
        </span>
    );
};
